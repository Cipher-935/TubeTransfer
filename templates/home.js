document.addEventListener("DOMContentLoaded", () => {
  
   const btn_in = document.querySelector(".btn_upload");
   const btn_delete = document.querySelector(".delete_btn");
   const btn_list = document.querySelector(".get_list");
   const btn_stream = document.querySelector(".btn_stream");

   btn_in.addEventListener("click", async (e) => {
       e.preventDefault();
       const file_input = document.getElementById("f_input");
       if(file_input.files.length > 0){
           const formData = new FormData();
           formData.append("file_data", file_input.files[0]);
           const sent_file = await fetch("http://127.0.0.1:4000/upload", {
            method: "POST",
            // headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: formData
           });
           if(sent_file.status === 200){
            const rec = await sent_file.json();
               alert(rec.resp);
           }
         
       }
       else{
           alert("THe file input is required");
       }
   });
   
   btn_delete.addEventListener("click", async (e) => {
    e.preventDefault();
    const input_key = document.getElementById("del-id").value;
    const obj = {main_key: input_key};
    console.log(obj);
    const rec_list = await fetch("http://127.0.0.1:4000/delete", {
        method: "POST",
        headers: {"Content-Type": "application/json"}, 
        body: JSON.stringify(obj)
    });
    if(rec_list.status === 200){
        const d_list = await rec_list.json();
        alert(d_list.resp);
    }
    else{
        alert("Did not receive anything");
    }
   }); 


   btn_list.addEventListener("click", async () => {
      const dat = await fetch("http://127.0.0.1:4000/list");
      const res = await dat.json();
      alert(res.resp); 
   });

   btn_stream.addEventListener("click", async (e) => {
       e.preventDefault();
       const file_input = document.getElementById("f_input");
       if(file_input.files.length > 0){
           const formData = new FormData();
           formData.append("file_data", file_input.files[0]);
           const sent_file = await fetch("http://127.0.0.1:4000/stream", {
            method: "POST",
            // headers: {"Content-Type": "application/x-www-form-urlencoded"},
            body: formData
           });
           if(sent_file.status === 200){
            const rec = await sent_file.json();
               alert(rec.resp);
           }
           else{
               alert("Not working");
           }
           
       }
       else{
           alert("THe file input is required");
       }
   });



});