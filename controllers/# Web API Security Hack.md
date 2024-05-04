# Web API Security Hack
## Preventing Web API attacks with Data Validation


## Introduction
Adequate data protection and user confidentiality are key responsibilities of the application developer hence, it is important to ensure the highest possible security while building various API endpoints. 
The act of application security is a shared responsibility amongst the client and server developers and negligence of one’s role can be disastrous.  Statistics that data breaches In 2023 resulted in exposure of over 8 million data records worldwide. 


 In this article, I will be touching on a key area of API security which is Data validation.  This concept is quite crucial in helping to protect your API from web attacks via malicious user data.  This tutorial is well-suited for all backend developers regardless of years of experience.
 
To be able to follow the tutorial, here are some prerequisites.
•	Knowledge of Node JS
•	Knowledge of npm and package installation
With this in place, let’s get started.


## Explaining Data validation
First of all, what is Data validation?  Data validation simply entails ensuring the accuracy and reliability of the data received from external sources before onward data processing. It is a key component of web API security as it is essential to prevent the occurrence of web injection attacks, SQL attacks and NoSQL attacks respectively. To know more about these, you can check this link. Also do note that data validation is needed but not limited to the following backend operations. 
•	User Login and Sign up
•	Response query
•	Updating Server databases


All these can be used as avenues by the mischievous black hat hackers to gain access to the Server database obtain sensitive user details or even wreak havoc by formatting the entire database.


## Popular Data validation tools
So far, there are quite a lot of tools that can help the programmer achieve efficient data validation in API development. They also have their benefits as they help avoid reinventing the wheel by using long regex codes to validate data. They provide a whole lot of features including error handling and   validation customization functionalities.  Some of these tools include
•	[Joi]()
•	[Zod]() 
•	[Yup]()
•	[AJv]()
•	[Valibot]()
•	[Validator.js]()
•	[Superstruct]()

To further shed light on these tools, we would love to do a gross comparison amongst some of the most popular data validation tools mentioned above.

## Pros and Cons of Data Validation Tools
To further enlighten you about these Javascript validation tools, I will be highlighting some pros and cons of three of these popular Javascript validation tools.
### Joi

Pros

•	It has a strong and large user community and development support
•	It has inbuilt capability to handle complex validations

Cons
•	It’s syntax is quite verbose

### Zod

Pros
•	It is easily compatible with Typescript projects
•	It has efficient error-handling capabilities

Cons
•	Async validation isn’t supported here.


### Yup

Pros
•	It mainly uses Declarative syntax to set its validation tool which confers its simplicity
•	It has a comparable fast performance.


Cons
•	It doesn’t provide customization features
•	It has limited ability to handle complex validations


 For the purpose of this tutorial, Joi would as be used as our data validation tool.

## Introduction to Joi
Joi is a simple efficient JavaScript-based Data validation tool which is based on the schema-type configuration. 
It has inbuilt capabilities to validate the occurrence of data in various forms not limited to Booleans, strings, functions and intervals and also handle complex validation operations. 
Additionally, it provides minimal caching functionalities. More information about the tool can be found here. 

## Setting up Joi
 In this section, we would set Joi up in our local environment. To install Joi, navigate to the code folder via the Command line and in the command line, enter 
 
`npm i joi`

A message confirming successful installation would then be displayed. With that completed, we will then demonstrate the power of Joi in validating user registration in our demo API.



## Demo Project
	
In this project, Joi would be used to validate the inputs received from the client-side with the intent to sign up on the server side. The default code for the user sign-up function for the node JS application can be found here.

Now, we would then go on to import  the installed Joi package into our code. 

`const Joi = require("joi");`

Thereafter, before writing our signup controller, we will initialize the Joi library within the code file. 
`const SignUpSchema = Joi.object({});`

In this project, we will validate the Email, password and username parameters received from the client. 

```
const SignUpSchema = Joi.object({
    email: Joi.string().email({
        minDomainSegments: 2,
        tlds: {
            allow: ['com', 'net']
        }
    }),
    username: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string().min(8).required()
});
```



The email parameter object ensures that the inputted email address is a string, and the domain site was limited to .com and .net disallowing other forms of domains. 

For the username parameter, it ensures that it is a string containing both letters and numbers with a minimum character count of 3 and a maximum character count of 15. 
The required function ensures that it must be compulsorily provided else the entire request wouldn’t be validated. 
The password parameter ensures that the password supplied is in a string format with a minimum character count of 8 and it is also compulsorily required. 

To apply it to our endpoints, we include this within the controller function

```
const { error, value } = SignUpSchema.validate(req.body, { abortEarly: false });
if (error) {
    res.status(400).json(error.details);
    return;
}
```

This function gets executed before inserting the user details into the database. The schema tries to validate the received input and then proceeds on to the database if successfully validated. 

The **abortEarly** feature is included to allow for all parameters to be assessed and all the errors would be displayed in case there is any. 
The above can also be replicated in the Login controller function. You can also checkout the documentation for other examples of complex validation options using Joi. 


The final  code for the project is displayed below.

```
const jwt = require("jsonwebtoken");
const userSchema = require("../Schema/User");
const Joi = require("joi");
const bcrypt = require("bcrypt");
const { createNewColumn, checkRecordsExists, insertRecord } = require('../utils/sqlSchemaFunction');

const generateAccessToken = (use) => {
    return jwt.sign({ userID: use }, process.env.JWT, { expiresIn: "1d" });
}

const SignUpSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    username: Joi.string().alphanum().min(3).max(15).required(),
    password: Joi.string().min(8).required()
});

const loginSchema = Joi.object({
    email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    password: Joi.string().min(8).required()
});

const register = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        res.status(400).json("Please supply the email or password");
        return; 
    }

    const { error, value } = SignUpSchema.validate(req.body, { abortEarly: false });
    if (error) {
        res.status(400).json(error.details);
        return;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = {
        username: req.body.username,
        email: email,
        password: hashedPassword
    };

    try {
        const userAlreadyExists = await checkRecordsExists("users", "email", email);
        if (userAlreadyExists) {
            res.status(400).json("Email must be unique");
        } else {
            await insertRecord("users", user);
            res.status(200).json("User created successfully");
        }
    } catch (err) {
        res.status(500).json({ err: err.message });
    }
};

module.exports = { register };

```
![failedValidation](https://hackmd.io/_uploads/HJpqL8Ok0.jpg)
These is an example of a failed validation attempt. 

![SUccessValid](https://hackmd.io/_uploads/Bkx2UL_1R.jpg)
Ensuring that the code followed our defined schema resulted in it been successfully executed.


 ## Conclusion
With this, we have come to the end of the tutorial. We hope you’ve learned essentially about data validation, various data validation tools and data validation best practices. 
You can also reach out to me and check out my other articles [here](linktr.ee/tobilyn77). Till next time, keep on coding!
