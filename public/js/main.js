const btn = document.querySelectorAll("button[data-id]");

btn.forEach(tag => {
    tag.addEventListener("click", () => {
        let id = tag.getAttribute("data-id");
        let name = tag.getAttribute("data-name");

        $.ajax({
            url:"/changeCount",
            method:"POST",
            data: { id, name },
            dataType:"JSON",
            // beforeSend:function(){
            //     $('#action_button').attr('disabled', 'disabled');
            // },
            success: function(data) {
                const spa = document.querySelector(`span[data-id="${id}"]`);
                const sm = document.querySelector(`small[data-id="${id}"]`);
                spa.textContent = data.count;
                sm.textContent = "Last updated " + data.updatedMoment;

                // setTimeout(function(){
                //     $('').html('');
                // }, 5000);
            }
        });
    })
});