
document.getElementById('job_form').addEventListener('submit', (e) => {
    e.preventDefault();

    const username = document.getElementById('username');
    const email = document.getElementById('email');
    const job_name = document.getElementById('job_name');
    const job_experience = document.getElementById('job_experience');
    const resume = document.getElementById('resume');

    let formData = new FormData();

    formData.append("username", username.value);
    formData.append("email", email.value);
    formData.append("job_name", job_name.value);
    formData.append("job_experience", job_experience.value);
    formData.append("resume", resume.files[0]);

    fetch('http://localhost:6001/form', {
        method: "POST",
        body: formData
    })
    .then((res) => res.json())
    .then((data) => {
        
        if (data?.code === 400) {
            document.getElementById('file_error').innerHTML = data?.message;
        }else if (data?.code === 200){
            document.getElementById('file_error').innerHTML = '';
            document.getElementById('upload_status').innerHTML = data?.message;
        }else{
            document.getElementById('file_error').innerHTML = '';
        }

    })
    .catch((err) => console.log(err))

})
