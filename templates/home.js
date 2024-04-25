
document.addEventListener("DOMContentLoaded", () => {
  
   const btn_upload = document.querySelector(".btn_upload");
   const btn_delete = document.querySelector(".delete_btn");
   const btn_stream = document.querySelector(".btn_stream");
   const btn_get_link = document.querySelector(".get-url");
   const btn_list = document.querySelector(".list_btn");
   const btn_put = document.querySelector('.btn_put');

   btn_upload.addEventListener("click", async (e) => {
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


   btn_stream.addEventListener("click", async (e) => {
       e.preventDefault();
       const file_input = document.getElementById("f_input");
       if(file_input.files.length > 0){
           const formData = new FormData();
           formData.append("file_data", file_input.files[0]);
           const sent_file = await fetch("http://127.0.0.1:4000/pipeline", {
            method: "POST",
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


   btn_get_link.addEventListener("click", async (e) => {
    e.preventDefault();
    const link_key = document.getElementById("file_name").value;
    const s_dat = {get_key: link_key};
    const rec_link = await fetch("http://127.0.0.1:4000/get-presign-link", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify(s_dat)
    });
    if(rec_link.status === 200){
        const final_link = await rec_link.json();
    }
    else if(rec_link.status === 404){
        alert(final_link.resp);
        
    }
   });

   btn_list.addEventListener("click", async (e) => {
      const send = await fetch("http://127.0.0.1:4000/get-list");
      if(send.status === 200){
        const dd = await send.json();
        
        for(let i = 0; i < dd.resp.length; i++){
            console.log(dd.resp[i].Key);
        }
      }
   });

   btn_put.addEventListener("click", async (e) => {
      e.preventDefault();
      const d_file = document.getElementById("d_file");
      if(d_file.files.length > 0){
         const mfile = {file_name: d_file.files[0].name, file_type: d_file.files[0].type};
         const rec_put_link = await fetch("http://127.0.0.1:4000/get-put-url",{
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify(mfile)
         });
         if(rec_put_link.status === 200){
            const final_url = await rec_put_link.json();
            const body_dat = new FormData();
            body_dat.append("file", d_file.files[0]);
            const put_req = await fetch(final_url.resp, {
                method: "PUT",
                body: body_dat
            });
            if(put_req.status === 200){
                alert("Hey the file was uploaded");
            }
            else{
                alert("Something went wrong");
            }
         }
         else{
            alert("Couldn't fetch the signed url");
         }
      }
      else{
        alert("File is required");
      }
   });

});