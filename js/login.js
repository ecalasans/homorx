$(document).ready(function (){
    $("#login_button").click(function (e){
        e.preventDefault();

        // Pega os valores digitados nos campos
        let usuario = document.getElementById('usuario').value;
        let senha = document.getElementById('senha').value;

        let dados_login = {
            'usuario' : usuario,
            'senha' : senha
        }

        // Faz a requisição para o servidor
        $.ajax({
            url: "http://localhost:8000/sysLogin/",
            type: 'post',
            datatype: 'json',
            data: dados_login,
            success: function (response) {
                if (response.resposta === 'logado'){
                    window.location.replace("http://localhost/homomorphic/sistema.html");
                } else {
                    alert('Você não tem acesso ao sistema!  Contacte o adminstrador.');
                }
            }
        })
    });
});