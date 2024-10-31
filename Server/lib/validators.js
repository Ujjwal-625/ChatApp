import {body,check,param,validationResult} from "express-validator";
import { ErrorHandler } from "../utils/utilty.js";

const registerValidator=()=>[
    body("name","Please Provide Name").notEmpty(),
    body("username","Please Provide userName").notEmpty(),
    body("password","Please Password").notEmpty(),
    body("bio","Please Provide bio").notEmpty(),
    body("email","Please Provide Email").notEmpty(),
    check("avatar","Please Upload Avatar").notEmpty()
]

const validatehandler=(req,res,next)=>{

    const errors =validationResult(req);

    const errorMessages=errors.array().map((ele)=>ele.msg).join(",");

    if(errors.isEmpty())return next();

    return next (new ErrorHandler(errorMessages,400));


}

const loginValidator=()=>[
    body("username","Please Provide userName").notEmpty(),
    body("password","Please Password").notEmpty(),
]

const newGroupValidator=()=>[
    body("name","Please Provide name").notEmpty(),
    body("members").notEmpty().withMessage("Please Provide Members Array")
    .isArray({min:2,max:100}).withMessage("Please Provide members in range of 1 to 99"),
]


const addmembersValidator=()=>[
    body("chatId","Please Provide chatId").notEmpty(),
    body("members").notEmpty().withMessage("Please Provide Members Array")
    .isArray({min:1,max:97}).withMessage("Please Provide members in range of 1 to 97"),
]

const removemembersValidator=()=>[
    body("chatId","Please Provide chatId").notEmpty(),
    body("userId","Please Provide userId").notEmpty()
]

const exitGroupValidator=()=>[
    param("id").exists().withMessage( "Please provide ChatId")
    .isLength({ min: 1 }).withMessage("min length should be 1")
    //this id is the dynamic route
]

const sendAttachmentsValidator=()=>[
    body("chatId").exists().withMessage( "Please provide ChatId"),
    check("files").isEmpty().withMessage("Please provide attachments")
        .isArray({ min: 1, max: 5 }).withMessage("Number of elements in attachment array should be between 1 to 5")
]

const getMessagesValidator=()=>[
    param("id").exists().withMessage( "Please provide ChatId")
    .isLength({ min: 1 }).withMessage("min length should be 1")
]

const getChatDetailsValidator=()=>[
    param("id").exists().withMessage( "Please provide ChatId")
    .isLength({ min: 1 }).withMessage("min length should be 1")
]

const renameGroupValidator=()=>[
    param("id").exists().withMessage( "Please provide ChatId")
    .isLength({ min: 1 }).withMessage("min length should be 1"),
    body("name").exists().withMessage( "Please provide ChatId")
    .isLength({ min: 1 }).withMessage("min length should be 1")
    // this make sure that it exists
]

const deleteChatValidator=()=>[
    param("id").exists().withMessage( "Please provide ChatId")
    .isLength({ min: 1 }).withMessage("min length should be 1")
    
]

const sendRequestValidator=()=>[
    body("userId" ,"Please Provide UserId").exists(),
]

const acceptRequestValidator = () => [
    body("requestId")
        .exists()
        .withMessage("Please Provide requestId"),
    body("accept")
        .notEmpty()
        .withMessage("Please Provide accept status")
        .isBoolean()
        .withMessage("Accept must be boolean")
];


export { registerValidator,
    validatehandler,
    loginValidator,
    newGroupValidator,
    addmembersValidator,
    removemembersValidator,
    exitGroupValidator,
    sendAttachmentsValidator,
    getMessagesValidator,
    getChatDetailsValidator,
    renameGroupValidator,
    deleteChatValidator,
    sendRequestValidator,
    acceptRequestValidator
}