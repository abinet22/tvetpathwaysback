module.exports = (sequelize, DataTypes) => {
   
    const Employer = sequelize.define("Employer", {
        employerid: {
            type: DataTypes.STRING
        },
        companyname: {
            type: DataTypes.STRING
        },
      
        contactperson: {
            type: DataTypes.STRING
        },
      
        email: {
            type: DataTypes.STRING
        },
        address: {
            type: DataTypes.STRING
        },
        phonenumber: {
            type: DataTypes.STRING
        },
        businesssector: {
            type: DataTypes.STRING
        },
        password: {
            type: DataTypes.STRING
        },
      
     
       
    });

  
    return Employer;
}