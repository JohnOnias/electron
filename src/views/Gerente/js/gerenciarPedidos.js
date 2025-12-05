// Variável global para armazenar o pedido atual sendo visualizado

let pedidoAtualDetalhes = null;

/**
 * Carregar e exibir todos os pedidos
 */
async function carregarPedidos() {
    try {
        const resultado = await window.api.gerentePedidos.getTodosPedidos();
        
        if (!resultado.success) {
            console.error("Erro ao carregar pedidos:", resultado.error);
            alert("Erro ao carregar pedidos: " + resultado.error);
            return;
        }

        const pedidos = resultado.data;
        const listaPedidos = document.getElementById('listaPedidos');
        listaPedidos.innerHTML = '';

        if (pedidos.length === 0) {
            listaPedidos.innerHTML = '<tr><td colspan="7" style="text-align:center;">Nenhum pedido encontrado</td></tr>';
            return;
        }

        for (let pedido of pedidos) {
            // Calcular total do pedido
            const detalhesResult = await window.api.gerentePedidos.getDetalhesPedido(pedido.id);
            const total = detalhesResult.success ? detalhesResult.data.total : 0;

            const tr = document.createElement('tr');
            tr.classList.add(pedido.status === 'Fechado' ? 'pedido-fechado' : 'pedido-aberto');
            
            tr.innerHTML = `
                <td>${pedido.id}</td>
                <td>Mesa ${pedido.mesa_numero}</td>
                <td><span class="status-badge status-${pedido.status.toLowerCase()}">${pedido.status}</span></td>
                <td>${pedido.nome_funcionario || 'N/A'}</td>
                <td>${formatarData(pedido.data_criacao)}</td>
                <td>R$ ${total.toFixed(2)}</td>
                <td>
                    <button class="btn-acao btn-ver" onclick="verDetalhesPedido(${pedido.id})">Ver</button>
                    ${pedido.status !== 'Fechado' ? 
                        `<button class="btn-acao btn-fechar" onclick="confirmarFecharPedido(${pedido.id})">Fechar</button>` 
                        : ''}
                </td>
            `;
            
            listaPedidos.appendChild(tr);
        }

    } catch (error) {
        console.error("Erro ao carregar pedidos:", error);
        alert("Erro ao carregar pedidos!");
    }
}

/**
 * Ver detalhes de um pedido específico
 */
async function verDetalhesPedido(pedidoId) {
    try {
        // Buscar informações do pedido principal
        const resultPedidos = await window.api.gerentePedidos.getTodosPedidos();
        const pedido = resultPedidos.data.find(p => p.id === pedidoId);
        
        if (!pedido) {
            alert("Pedido não encontrado!");
            return;
        }

        // Buscar detalhes dos itens
        const resultado = await window.api.gerentePedidos.getDetalhesPedido(pedidoId);
        
        if (!resultado.success) {
            alert("Erro ao carregar detalhes: " + resultado.error);
            return;
        }

        pedidoAtualDetalhes = {
            id: pedidoId,
            mesa: pedido.mesa_numero,
            status: pedido.status,
            itens: resultado.data.itens,
            total: resultado.data.total
        };

        // Preencher modal
        document.getElementById('pedidoIdModal').textContent = pedidoId;
        document.getElementById('mesaModal').textContent = pedido.mesa_numero;
        document.getElementById('statusModal').textContent = pedido.status;
        document.getElementById('totalPedidoModal').textContent = resultado.data.total.toFixed(2);

        const listaItens = document.getElementById('listaItensPedido');
        listaItens.innerHTML = '';

        if (resultado.data.itens.length === 0) {
            listaItens.innerHTML = '<tr><td colspan="5" style="text-align:center;">Nenhum item neste pedido</td></tr>';
        } else {
            resultado.data.itens.forEach(item => {
                const subtotal = item.quantidade * item.preco_unitario;
                const tr = document.createElement('tr');
                tr.innerHTML = `
                    <td>${item.nome_produto}</td>
                    <td>${item.quantidade}</td>
                    <td>R$ ${item.preco_unitario.toFixed(2)}</td>
                    <td>R$ ${subtotal.toFixed(2)}</td>
                    <td>
                        ${pedido.status !== 'Fechado' ? 
                            `<button class="btn-acao btn-remover" onclick="removerProdutoDoPedido(${item.id})">Remover</button>` 
                            : 'N/A'}
                    </td>
                `;
                listaItens.appendChild(tr);
            });
        }

        // Mostrar/ocultar botão de fechar pedido
        const btnFechar = document.getElementById('btnFecharPedidoModal');
        if (pedido.status === 'Fechado') {
            btnFechar.style.display = 'none';
        } else {
            btnFechar.style.display = 'inline-block';
            btnFechar.onclick = () => confirmarFecharPedido(pedidoId);
        }

        // Exibir modal
        document.getElementById('modalDetalhesPedido').style.display = 'block';

    } catch (error) {
        console.error("Erro ao ver detalhes:", error);
        alert("Erro ao carregar detalhes do pedido!");
    }
}

/**
 * Remover um produto do pedido
 */
async function removerProdutoDoPedido(itemId) {
    if (!confirm("Tem certeza que deseja remover este produto do pedido?")) {
        return;
    }

    try {
        const resultado = await window.api.gerentePedidos.removerProduto(itemId);
        
        if (resultado.success) {
            alert("Produto removido com sucesso!");
            // Recarregar detalhes do pedido
            await verDetalhesPedido(pedidoAtualDetalhes.id);
            // Recarregar lista de pedidos
            await carregarPedidos();
        } else {
            alert("Erro ao remover produto: " + resultado.error);
        }

    } catch (error) {
        console.error("Erro ao remover produto:", error);
        alert("Erro ao remover produto!");
    }
}

/**
 * Confirmar e fechar um pedido
 */
async function confirmarFecharPedido(pedidoId) {
    if (!confirm("Tem certeza que deseja FECHAR este pedido? A mesa será liberada.")) {
        return;
    }

    try {
        const resultado = await window.api.gerentePedidos.fecharPedido(pedidoId);
        
        if (resultado.success) {
            alert(`Pedido fechado com sucesso! Mesa ${resultado.data.mesa_numero} foi liberada.`);
            fecharModal();
            await carregarPedidos();
        } else {
            alert("Erro ao fechar pedido: " + resultado.error);
        }

    } catch (error) {
        console.error("Erro ao fechar pedido:", error);
        alert("Erro ao fechar pedido!");
    }
}

/**
 * Fechar modal de detalhes
 */
function fecharModal() {
    document.getElementById('modalDetalhesPedido').style.display = 'none';
    pedidoAtualDetalhes = null;
}

/**
 * Formatar data para exibição
 */
function formatarData(dataString) {
    if (!dataString) return 'N/A';
    const data = new Date(dataString);
    return data.toLocaleString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Event listener para o botão "Gerenciar Pedidos" no menu
document.getElementById('btnGerenciarPedidos')?.addEventListener('click', async (e) => {
    e.preventDefault();
    
    // Esconder todas as telas
    document.querySelectorAll('.tela').forEach(tela => tela.style.display = 'none');
    
    // Mostrar tela de gerenciar pedidos
    document.getElementById('telaGerenciarPedidos').style.display = 'block';
    
    // Carregar pedidos
    await carregarPedidos();
});

// Fechar modal ao clicar fora dele
window.onclick = function(event) {
    const modal = document.getElementById('modalDetalhesPedido');
    if (event.target === modal) {
        fecharModal();
    }
}