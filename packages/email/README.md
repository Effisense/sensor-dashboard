# Sensor Dashboard: `email`

## Purpose

This package contains email templates that can be used **in the future** when sending email push notifications.

## Using `react-email`

React Email is a library that allows the developer to write JSX code as you would for a website, and then beautifully renders it as a responsive email. It is a React-based framework that allows you to build emails with React.

The intention is to consume the package using the `sendEmail` function defined in [`index.tsx`](/packages/email/index.tsx). This function will render the email template, and return the HTML to be sent in the email. Sendgrid will be used as the service to send the email.
