import React from 'react';

const FormField = (props) => {
  let forName = props.for, 
      fieldLabel = props.fieldLabel,
      placeholder = props.placeholder,
      isRequired = props.isRequired,
      inputType = props.inputType;

  return (
    <label htmlFor={forName}>
       <span>{fieldLabel} 
         {
          isRequired? <span className="required">*</span> : <span/>
         }
       </span>
       <input type={props.inputType} className="inputField" name={forName} 
              placeholder={placeholder} onBlur={(e) => props.action(e)}/>
    </label>
  );
};

export default FormField;

