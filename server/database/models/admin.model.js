
// [LOGIC]: here admin behave as a seller
// FREEDOM SPACE TO ADD ANYTHING RELATED TO ADMIN IN FUTURE

const adminSchema = new Schema(
    {   
        // UID: FK
        userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        },

        // COMMERICAL INFO
        businessName: { type: String, required: true },
        businessDetails: { type: Object, required: true },
        bankDetails: { type: Object, required: true },

        //
        ratings: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        softDelete: { type: Boolean, default: false },

        //--[SENU]-------to store products related to seller------------------------------
        products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product', default: [] }] 
        //--------------------END---------------------------------------------------------

    },

    {
    timestamps: true,
    versionKey: false,
    }
);

  export default adminSchema