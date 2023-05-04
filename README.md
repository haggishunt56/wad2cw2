# Douglas Pollock
## S2003426
## Web Application Development 2
## Coursework 2

This application has been developed by Douglas Pollock in response to the web-based practical coursework (GCU module M3I326794).

### Running the application

To run the application, clone this repository into the desired directory, navigate to the directory and run the following commands:

1. `npm install` to install dependencies and libraries used by this project.

2. `node index.js` **OR** `nodemon index.js`

`node` will start the application, but if changes are made to the code it will need to be manually stopped and started again to load the changes. `nodemon` will restart the application any time a change is made to a javascript file. It does not reload for changes to mustache files.

### Features

Most of the application is accessible only after login. Unverified users (users not logged in) can access the following resources:
- Landing page
- Login
- Registration
- About us

Users must be logged in to access the remaining features of the application. To log in, an account must be created first using the registration tool. Details are saved in a local NeDB database file. Passwords are hashed for security.
Verified users can access the following features:
- Create goals in each of the following categories:
    - Nutrition
    - Fitness
    - Healthy lifestyle
- View and edit their own goals
- Delete their own goals
- Add personal achievements
- View a trophy cabinet of their achievements
- View guides/blog posts on the following topics:
    - Nutrition
    - Fitness
    - Lifestyle

The application has been tested on different viewport sizes and is suitable for use on a range of different devices.

### Suggested improvements
1. Nunjucks should be used as the templating engine instead of Mustache. Nunjucks offers more features than Mustache, including logic and formatting. For example, NeDB saves dates as Date objects but these are not user-friendly when printed on the page as-is. Nunjucks offers filters to change the date string into something more user-friendly. With Mustache, this has to be done by the JavaScript code before being passed to the template.

2. Users can view or edit goals for other users if they know the id of the goal. They are a random string so may be difficult to guess, but some server-side verification is required to prevent this from happening.

3. Some basic input field validation is applied server-side. Mostly this is just checking if a required field is blank and returning an error to the user if it is. More validation is required though, such as checking that dates are provided in date fields and email addresses are in the correct format, e.g. john@example.com

4. Browser compatibility - CSS styles have been tested on Google Chrome and Opera browsers. Additional browsers should be tested such as Edge, Safari, Firefox and Internet Explorer.

5. Allow login using *either* the email address *or* username. Currently users can only login with the username.