import React from 'react';

const SelectInput = (props) => {
  let options = props.options, 
      isRequired = props.isRequired, 
      fieldLabel = props.fieldLabel,
      placeHolder = props.placeHolder, 
      optId = props.optId;

  return (
    <label>
       <span>{fieldLabel}
         {
          isRequired? <span className="required">*</span> : <span/>
         }
       </span>
      <datalist id={optId}>
        {
          options.map((opt, i) => <option key={i} value={opt}>{opt}</option>)
        }
      </datalist>
      <input type="text" list={optId} placeholder={placeHolder} 
             onKeyUp={(e) => props.keyUp(e)} onBlur={(e) => props.select(e)} />
    </label>
  );
};

export default SelectInput;

