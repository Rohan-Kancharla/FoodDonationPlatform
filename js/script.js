document.addEventListener('DOMContentLoaded', function () {
    // Donation Form Toggle
    const donationButtons = document.querySelectorAll('.donation-options .btn');

    if (donationButtons.length > 0) {
        donationButtons.forEach(button => {
            button.addEventListener('click', function (e) {
                e.preventDefault();

                // Get the target form ID from the href attribute
                const targetFormId = this.getAttribute('href');

                // Hide all forms first
                const allForms = document.querySelectorAll('.donation-form');
                allForms.forEach(form => {
                    form.classList.add('hidden');
                });

                // Show the target form
                const targetForm = document.querySelector(targetFormId);
                if (targetForm) {
                    targetForm.classList.remove('hidden');

                    // Smooth scroll to the form
                    targetForm.scrollIntoView({ behavior: 'smooth' });
                }
            });
        });
    }

    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('nav');

    if (menuToggle) {
        menuToggle.addEventListener('click', function () {
            nav.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // FAQ Accordion
    const faqItems = document.querySelectorAll('.faq-item');

    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                // Close all other items
                faqItems.forEach(otherItem => {
                    if (otherItem !== item && otherItem.classList.contains('active')) {
                        otherItem.classList.remove('active');
                        const icon = otherItem.querySelector('.toggle-icon i');
                        icon.classList.remove('fa-minus');
                        icon.classList.add('fa-plus');
                    }
                });

                // Toggle current item
                item.classList.toggle('active');
                const icon = item.querySelector('.toggle-icon i');
                if (item.classList.contains('active')) {
                    icon.classList.remove('fa-plus');
                    icon.classList.add('fa-minus');
                } else {
                    icon.classList.remove('fa-minus');
                    icon.classList.add('fa-plus');
                }
            });
        });
    }

    // Payment Method Selection
    const paymentMethods = document.querySelectorAll('.payment-method');
    const creditCardDetails = document.getElementById('creditCardDetails');

    if (paymentMethods.length > 0 && creditCardDetails) {
        paymentMethods.forEach(method => {
            const radio = method.querySelector('input[type="radio"]');
            radio.addEventListener('change', function () {
                if (this.value === 'creditCard') {
                    creditCardDetails.style.display = 'block';
                } else {
                    creditCardDetails.style.display = 'none';
                }
            });
        });
    }

    // Form Validation
    const forms = document.querySelectorAll('form');

    if (forms.length > 0) {
        forms.forEach(form => {
            form.addEventListener('submit', function (e) {
                e.preventDefault();

                let isValid = true;
                const requiredFields = form.querySelectorAll('[required]');

                requiredFields.forEach(field => {
                    if (!field.value.trim()) {
                        isValid = false;
                        field.classList.add('error');

                        // Add error message if it doesn't exist
                        let errorMessage = field.nextElementSibling;
                        if (!errorMessage || !errorMessage.classList.contains('error-message')) {
                            errorMessage = document.createElement('div');
                            errorMessage.classList.add('error-message');
                            errorMessage.textContent = 'This field is required';
                            field.parentNode.insertBefore(errorMessage, field.nextSibling);
                        }
                    } else {
                        field.classList.remove('error');

                        // Remove error message if it exists
                        const errorMessage = field.nextElementSibling;
                        if (errorMessage && errorMessage.classList.contains('error-message')) {
                            errorMessage.remove();
                        }
                    }
                });

                if (isValid) {
                    // Get form ID to determine which API endpoint to use
                    const formId = form.getAttribute('id');
                    let apiEndpoint = '';

                    // Set the appropriate API endpoint based on form ID
                    if (formId === 'businessDonationForm') {
                        apiEndpoint = '/api/business-donation';
                    } else if (formId === 'individualDonationForm') {
                        apiEndpoint = '/api/individual-donation';
                    } else if (formId === 'financialDonationForm') {
                        apiEndpoint = '/api/financial-donation';
                    }

                    // Create form data object
                    const formData = {};
                    const formElements = form.elements;

                    for (let i = 0; i < formElements.length; i++) {
                        const element = formElements[i];
                        if (element.name && element.name !== '') {
                            if (element.type === 'checkbox') {
                                formData[element.name] = element.checked;
                            } else if (element.type === 'radio') {
                                if (element.checked) {
                                    formData[element.name] = element.value;
                                }
                            } else {
                                formData[element.name] = element.value;
                            }
                        }
                    }

                    // Show loading state
                    const submitButton = form.querySelector('button[type="submit"]');
                    const originalButtonText = submitButton.textContent;
                    submitButton.disabled = true;
                    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';

                    // Simulate API call
                    setTimeout(() => {
                        // Show success message
                        const formContainer = form.parentElement;
                        form.style.display = 'none';

                        const successMessage = document.createElement('div');
                        successMessage.classList.add('success-message');
                        successMessage.innerHTML = `
                            <div class="success-icon">
                                <i class="fas fa-check-circle"></i>
                            </div>
                            <h3>Thank You!</h3>
                            <p>Your submission has been received successfully. We'll get back to you shortly.</p>
                            <button class="btn btn-primary reset-form">Submit Another</button>
                        `;

                        formContainer.appendChild(successMessage);

                        // Reset form button
                        const resetButton = successMessage.querySelector('.reset-form');
                        if (resetButton) {
                            resetButton.addEventListener('click', function () {
                                form.reset();
                                successMessage.remove();
                                form.style.display = 'block';
                                submitButton.disabled = false;
                                submitButton.textContent = originalButtonText;
                            });
                        }
                    }, 1000);
                }
            });

            // Real-time validation
            const inputs = form.querySelectorAll('input, select, textarea');
            inputs.forEach(input => {
                input.addEventListener('blur', function () {
                    if (this.hasAttribute('required') && !this.value.trim()) {
                        this.classList.add('error');
                    } else {
                        this.classList.remove('error');
                    }
                });

                input.addEventListener('input', function () {
                    if (this.classList.contains('error') && this.value.trim()) {
                        this.classList.remove('error');

                        // Remove error message if it exists
                        const errorMessage = this.nextElementSibling;
                        if (errorMessage && errorMessage.classList.contains('error-message')) {
                            errorMessage.remove();
                        }
                    }
                });
            });
        });
    }

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                if (nav && nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    if (menuToggle) {
                        const icon = menuToggle.querySelector('i');
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Add CSS for form validation
    const style = document.createElement('style');
    style.textContent = `
        .error {
            border-color: var(--danger-color) !important;
        }
        
        .error-message {
            color: var(--danger-color);
            font-size: 0.9rem;
            margin-top: 5px;
        }
        
        .success-message {
            text-align: center;
            padding: 40px;
        }
        
        .success-icon {
            font-size: 4rem;
            color: var(--success-color);
            margin-bottom: 20px;
        }
        
        .success-message h3 {
            font-size: 1.8rem;
            margin-bottom: 10px;
        }
        
        .success-message p {
            margin-bottom: 20px;
        }
    `;
    document.head.appendChild(style);
});