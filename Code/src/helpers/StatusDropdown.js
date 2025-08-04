
export default function StatusDropdown({ value = "", fn }) {
  
  return (
      <select 
        className="form-select selectboxdropdown"
        name="status"
        value={value}
        onChange={(e) => {
          if (fn) fn(e);
        }}
      >
        <option value="2" selected={'2'===value?true:false}>Select Status</option>
              <option  value={'1'} selected={'1'===value?true:false}>Active</option>
              <option  value={'0'} selected={'0'===value?true:false}>InActive</option>
          
      </select>
   
  );
}


