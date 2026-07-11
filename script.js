// JOPA Foundation Formspree Handler

document.querySelectorAll("form[data-form-name]").forEach((form) => {

  form.addEventListener("submit", async function(e) {

    e.preventDefault();

    const button = form.querySelector("button[type='submit']");
    const originalText = button.innerHTML;

    button.disabled = true;
    button.innerHTML = "Sending...";

    const formData = new FormData(form);

    try {

      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          "Accept": "application/json"
        }
      });

      if (response.ok) {

        form.reset();

        const target = form.dataset.successTarget;

        const successMessage = document.querySelector(
          `.form-success[data-success-for="${target}"]`
        );

        if (successMessage) {
          successMessage.style.display = "flex";
        }

      } else {

        alert("There was an error sending your message. Please try again.");

      }

    } catch (error) {

      alert("Connection error. Please try again.");

    }

    button.disabled = false;
    button.innerHTML = originalText;

  });

});