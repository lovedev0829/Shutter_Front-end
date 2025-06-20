export default function Selectbox({
  labelName,
  options,
  handleChange,
  id,
  name,
  value,
  required,
  iscolor=false,
  disabledselectBox
}) {


  
  return (
    <>
      <label className="font-14" htmlFor={id}>
        {labelName} {required &&<sup>*</sup>}
      </label>

      <select
        id={id}
        name={name}
        value={value}
        onChange={handleChange}
        className="form-select"
        style={{
          backgroundColor: value, color: iscolor ? "#fff" :"#000"
        }}
        disabled={disabledselectBox}
      >
        <option value="">Select an option</option>
        {options.map((option, index) => (
          <option
            key={index}
            value={option.value}
            selected={option.value === value ? true : false}
            style={{ backgroundColor: option.value, color:  iscolor ? "#fff" :"#000"}}
          >
            {option.label}
          </option>
        ))}
      </select>
    </>
  );
}
