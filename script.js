function salvarFormulario() {
    var validarN = validarNome();
    var validarI = validarIdade();
    if (validarN && validarI) {
        var form = dadosFormulario();
        novoDado(form);
        resetar();
    }
}

function dadosFormulario() {
    var form = {};
    form["nome"] = document.getElementById("nome").value;
    form["idade"] = document.getElementById("idade").value;
    return form;
}

function novoDado(data) {
    var tabela = document.getElementById("lista").getElementsByTagName('tbody')[0];
    var nomeIgual = false;
    nomes = tabela.getElementsByTagName("td");
    for (var i = 0; i < nomes.length; i++) {
        if (nomes[i].innerText.toLowerCase() == data.nome.toLowerCase() && nomes[i].id.includes("nome")) {
            nomeIgual = true;
            break;
        }
    }
    if (!nomeIgual) {
        var novaLinha = tabela.insertRow(tabela.length);
        celula1 = novaLinha.insertCell(0);
        celula1.innerHTML = data.nome;
        celula1.id = "nome" + tabela.length;
        celula2 = novaLinha.insertCell(1);
        celula2.innerHTML = data.idade;
        celula2 = novaLinha.insertCell(2);
        celula2.innerHTML = `<input type="button" value="Excluir" class="btn btn-primary mr-4" onClick="excluir(this)">
                            <input type="button" value="Editar" id="btoSalvar" class="btn btn-primary mr-4" onClick="editar(this)" onClick ="salvar">
                            <input type="button" id="cancelar" onClick="cancelar(this)" class="invisible btn btn-primary" value="Cancelar">`;
    }
    else {
        alert("Esse Nome ja foi inserido!");
    }
}

function resetar() {
    document.getElementById("nome").value = "";
    document.getElementById("idade").value = "";
}


function editar(td) {
    var tr = td.parentNode.parentNode;
    var campos = tr.getElementsByTagName("td");

    var botaoCancelar = campos[2].querySelector("#cancelar");
    botaoCancelar.classList.remove("invisible");
    // }

    if (td.value == "Editar") {
        for (var i = 0; i < (campos.length - 1); i++) {
            if (!campos[i].className.includes("input")) {
                var newInputBox = document.createElement("input");
                newInputBox.setAttribute("type", "text");
                newInputBox.setAttribute("id", "input" + i);
                newInputBox.placeholder = campos[i].innerText;
                campos[i].classList.add("input");
                campos[i].appendChild(newInputBox);
                removerTexto(campos[i]);
            }
        };
        td.value = "Salvar";
    } else {
        for (var i = 0; i < (campos.length - 1); i++) {
            var elemento = campos[i].getElementsByTagName("input");
            var valor = elemento[0].value != '' ? elemento[0].value : elemento[0].placeholder;
            campos[i].innerText = valor;
            campos[i].classList.remove("input");
        };
        td.value = "Editar";
        var botaoCancelar = campos[2].querySelector("#cancelar");
        botaoCancelar.classList.add("invisible");
    }
}

function cancelar(td) {
    var tr = td.parentNode.parentNode;
    var campos = tr.getElementsByTagName("td");
    for (var i = 0; i < (campos.length - 1); i++) {
        var elemento = campos[i].getElementsByTagName('input');
        campos[i].innerText = elemento[0].placeholder;
        campos[i].classList.remove("input");
    };
    botaoSalvar = td.parentNode.parentNode.querySelector("#btoSalvar");
    botaoSalvar.value = "Editar";
    botaoCancelar = campos[2].querySelector("#cancelar");
    botaoCancelar.classList.add("invisible");
}

function excluir(td) {
    if (confirm("Deseja apagar esta linha?")) {
        row = td.parentElement.parentElement;
        document.getElementById("lista").deleteRow(row.rowIndex);
        resetar();
    }
}

var tabelas = document.querySelectorAll("table.sortable"),
    tabelaOrganizada,
    thead,
    cabecalhos,
    i,
    j;

for (i = 0; i < tabelas.length; i++) {
    tabelaOrganizada = tabelas[i];

    if (thead = tabelaOrganizada.querySelector("thead")) {
        cabecalhos = thead.querySelectorAll("th");

        for (j = 0; j < cabecalhos.length; j++) {
            cabecalhos[j].innerHTML = "<a href='#'>" + cabecalhos[j].innerText + "</a>";
        }

        thead.addEventListener("click", organizarTabela(tabelaOrganizada));
    }
}
function organizarTabela(tabela) {
    return function (org) {
        if (org.target.innerText != 'Ações') {
            if (org.target.tagName.toLowerCase() == 'a') {
                organizarLinha(tabela, indexadoraDeLinha(org.target.parentNode));
                org.preventDefault();
            }
        }
    };
}

function indexadoraDeLinha(node) {
    var cont = 0;
    while (node = node.previousElementSibling) {
        cont++;
    }
    return cont;
}

function organizarLinha(tabela, indiceColuna) {
    var linhas = tabela.querySelectorAll("tbody tr"),
        celula = "thead th:nth-child(" + (indiceColuna + 1) + ")",
        celula2 = "td:nth-child(" + (indiceColuna + 1) + ")",
        listaClasse = tabela.querySelector(celula).classList,
        valores = [],
        tipoClasse = "",
        todosNum = true,
        val,
        indice,
        node,
        checaOrdenacao = [],
        ordenado = false;

    if (listaClasse) {
        if (listaClasse.contains("numero")) {
            tipoClassi = "numero";
        }
    }
    for (indice = 0; indice < linhas.length; indice++) {
        node = linhas[indice].querySelector(celula2);
        val = node.innerText;
        if (isNaN(val)) {
            allNum = false;
        } else {
            val = parseFloat(val);
        }
        valores.push({ value: val, row: linhas[indice] });
    }
    if (tipoClasse == "" && todosNum) {
        tipoClasse = "numero";
    }
    if (tipoClasse == "numero") {
        checaOrdenacao = JSON.parse(JSON.stringify(valores));
        valores.sort(organizarNumeros);
        if (JSON.stringify(checaOrdenacao) == JSON.stringify(valores)) {
            valores = InverterArray(valores);
        }

    } else {
        checaOrdenacao = JSON.parse(JSON.stringify(valores));
        valores.sort(organizarTexto);

        if (JSON.stringify(checaOrdenacao) == JSON.stringify(valores)) {
            valores = InverterArray(valores);
        }
    }
    for (var i = 0; i < valores.length; i++) {
        tabela.querySelector("tbody").appendChild(valores[i].row);
    }
}
function InverterArray(array) {
    var ret = new Array;
    for (var i = array.length - 1; i >= 0; i--) {
        ret.push(array[i]);
    }
    return ret;
}

function organizarNumeros(a, b) {
    return organizarN(a.value, b.value);
}

function organizarN(a, b) {
    return (a > b) ? 1 : ((b > a) ? -1 : 0);;
}

function organizarTexto(a, b) {
    var textoA = (a.value + "").toUpperCase();
    var textoB = (b.value + "").toUpperCase();

    if (TextoA < TextoB) {
        return -1;
    }
    if (textoA > textoB) {
        return 1;
    }
    return 0;
}

//remove o texto do objeto no momento que se aperta o botão na edição, de forma a deixar apenas o input ali.
function removerTexto(element) {


    var nos = element.childNodes;

    for (var i = 0; i < nos.length; i++) {

        var no = nos[i];


        if (no.nodeType == Node.TEXT_NODE) {

            no.parentNode.removeChild(no);


            i--;

        } else


            if (no.nodeType == Node.ELEMENT_NODE) {

                removerTexto(no);

            }
    }
}

function validarNome() {
    nomeValido = true;
    if (document.getElementById("nome").value == "") {
        nomeValido = false;
        document.getElementById("validacaoNome").removeAttribute("hidden");
    } else {
        nomeValido = true;
        if (!document.getElementById("validacaoNome").hasAttribute("hidden")) {
            document.getElementById("validacaoNome").setAttribute("hidden", '');
        }
    }
    return nomeValido;
}

function validarIdade() {
    idadeValida = true;
    if (document.getElementById("idade").value == "") {
        idadeValida = false;
        document.getElementById("validacaoIdade").removeAttribute("hidden");
    } else {
        idadeValida = true;
        if (!document.getElementById("validacaoIdade").hasAttribute("hidden")) {
            document.getElementById("validacaoIdade").setAttribute("hidden", '');
        }
    }
    return idadeValida;
}