const btns = document.getElementsByClassName('card');
Array.from(btns).forEach(b=>{
    b.addEventListener('click',(e)=>{
        const id = b.querySelector('#itemid').innerHTML;
        window.location.href=`/item/${id}`;
    })
})