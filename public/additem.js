const toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
});

document.getElementById('submit').addEventListener('click', async (e) => {
    e.preventDefault();
    const name = document.getElementById('item').value;
    const description = document.getElementById('description').value;
    const price = document.getElementById('price').value;
    const file = document.querySelector('#image')?.files[0];
    let b;
    if(file)
    {
        b = await toBase64(file);
    }

    try {
        const res = await fetch('http://localhost:5500/item/add', {
            method: 'post',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, description, price, image:b })
        });

        if (res.ok) {
            alert('Item Added!');
            window.location.href = '/item';
        }
        else {
            alert('some error occured');
            window.location.reload();
        }

    } catch (err) {
        alert('some error occured');
        window.location.reload();
    }
})
