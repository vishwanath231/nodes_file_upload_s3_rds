
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
            getFetchData();
            username.value = '';
            email.value = '';
            job_name.value = '';
            job_experience.value = '';
            resume.value = '';
            document.getElementById('file_error').innerHTML = '';
            document.getElementById('upload_status').innerHTML = data?.message;
        }else{
            document.getElementById('file_error').innerHTML = '';
        }
    })
    .catch((err) => console.log(err))
})



function getFetchData(){
    fetch(`http://localhost:6001/all`)
        .then(res => res.json())
        .then((data) => {
            console.log(data);
            if (data) {

                let result = '';

                data.forEach((val) => {
                    result += `
                    <tr class="bg-white border-b">
                        <th scope="row" class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                            ${val.username}
                        </th>
                        <td class="px-6 py-4">
                            ${val.email}
                        </td>
                        <td class="px-6 py-4">
                            ${val.job_name}
                        </td>
                        <td class="px-6 py-4">
                            ${val.job_experience}
                        </td>
                        <td class="px-6 py-4">
                            <a href="${val.resume}" target="_blank">
                                <img src='/css/tab.png' class='w-6' alt='Resume' />
                            </a>
                        </td>
                    </tr>
                    `;
                })

                document.getElementById('tbody').innerHTML = result;
            }
        })
        .catch((err) => console.log(err))
}

getFetchData();