import Joi from "joi";

const productValidSchema = Joi.object({

    // PRODUCT NAME RULES
    productName: Joi.string().min(3).max(100).required().messages({
        "string.empty": "NAME CAN'T BE EMPTY",
        "string.min"  : "NAME MUST BE AT LEAST 3 CHARACTERS",
        "string.max"  : "NAME EXCEED THE LIMIT OF CHARACTERS (100)"
    }),

    // DESCRIPTION RULES
    description: Joi.string().min(20).max(500).required().messages({
        "string.empty": "AT LEAST ADD A STATEMENT ABOUT THE PRODUCT",
        "string.min"  : "DESCRIPTION MUST BE AT LEAST 20 CHARACTERS",
        "string.max"  : "DESCRIPTION EXCEED THE LIMIT OF CHARACTERS (500)"
    }),

    //PRICE RULES
    price: Joi.number().min(0).required().messages({
        "number.min": "PRICE CANNOT BE NEGATIVE",
    }),

    // CATEGORY ID RULES 
    //[extraction function by name will be later in validation layer]
    categoryId: Joi.string().required(),

    //
    stockQuantity: Joi.number().min(0).required().messages({
        "number.min": "PRICE CANNOT BE NEGATIVE",
    })
    
})


export default productValidSchema;


// validator allow only what parse here