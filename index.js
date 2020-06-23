const express = require("express")
const app = express()
app.use(express.json())
const produto = [
    {
        id:1,
        nome: "camisa",
        qtd: 60,
        valorUnidade: 40,
        complemento: [],
        precoTotal: 0,
        precoVenda: 0,
        lucro: 0,
        situacao: "",
        

    },

]
function minhaFuncao() {
    for (let i=0;i<produto.length;i++) {
        produto[i].precoTotal = produto[i].qtd * produto[i].valorUnidade
        produto[i].precoVenda = produto[i].valorUnidade + (0.20 * produto[i].valorUnidade)
        produto[i].lucro = produto[i].precoVenda - produto[i].valorUnidade
        if (produto[i].qtd < 50) {
            produto[i].situacao = "Estável"
        }
        if (produto[i].qtd >= 50 && produto[i].qtd < 100 ) {
            produto[i].situacao = "Boa"
        }
        if (produto[i].qtd >= 100 ) {
            produto[i].situacao = "Excelente"
        }
    }
}
minhaFuncao()
function erroParams(request, response, next) {
    const {id} = request.params
    const produtoId = produto.filter((casa) => {
        return casa.id == id

    })
    if (produtoId.length == 0) {
        return response.status(400).json({message: `Não existe um produto com este ID!`})
    }
    return next()
}

function erroBody(request, response, next) {
    const {id, nome, qtd, valorUnidade, complemento} = request.body
        if (id === ""|| nome === ""|| qtd === ""  || valorUnidade === "" || complemento === "" ) {
            return response.status(400).json({message: `O campo id do produto ou nome do produto ou quantidade ou valor unitario ou complemento não existe no corpo da requisição`})
        }
        else {
            return next()
        }
}

function mensagem(request, response, next) {
    console.log("Controle de Estoque da Empresa ABC")
    return next()
}
app.get("/produto", mensagem, (request, response) => {
    return response.json(produto)
})

app.get("/produto/:id", mensagem,erroParams, (request, response) => {
    const {id} = request.params
    let produtoId = produto.filter(casa => casa.id === Number(id))
    return response.json(produtoId)
})

app.post("/produto", mensagem,erroBody, (request, response) => {
    produto.push(request.body)
    minhaFuncao()
    return response.json(produto)

})

app.put("/produto", mensagem, erroBody, (request, response) => {
    const id = request.body.id
    let produtoId = 0
    let index = 0
    produtoId = produto.filter((produto, indice) => {
        if (produto.id === id) {
            index = indice
            return produto.id === id
            
        }

    })
    if (produtoId.length === 0) {
        return response.status(400).json({message:`Não existe um produto com este ID!`})

    }
    produto[index] = request.body
    minhaFuncao()
    return response.json(produto)
    
})

app.delete("/produto" ,mensagem, (request, response) => {
    const {id} = request.body
    let index = 0
    let produtoId = produto.filter((casa, indice) => {
        if (casa.id === Number(id)) {
            index = indice
            return casa.id === Number(id)
        }
    })
    if (produtoId.length === 0) {
        return response.status(400).json({message:`Não existe um produto com este ID!`})

    }
    let deletar = produto.splice(index, 1)
    console.log(deletar)

    return response.json(produto)

})

app.post("/produto/:id/complemento", erroBody,mensagem, (request, response) => {
    const id = request.params.id
    let index = 0
    let adicao = request.body.complemento
    let produtoId = produto.filter((casa, indice) => {
        if (casa.id === Number(id)) {
            index = indice
            return casa.id === Number(id)
        }
    })
    if (produtoId.length === 0) {
        return response.status(400).json({message:`Não existe um produto com este ID!`})
    
    }
    produto[index].complemento.push(adicao)
    return response.json(produto)
    
})


app.listen(3333, () => {
    console.log("Servidor Rodando") 
})