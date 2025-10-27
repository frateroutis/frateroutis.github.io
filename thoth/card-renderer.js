// Parser e renderizador de markdown para as descrições das cartas
class MarkdownRenderer {
    constructor() {
        this.rules = [
            // Headers
            { pattern: /^### (.*$)/gim, replacement: '<h3>$1</h3>' },
            { pattern: /^## (.*$)/gim, replacement: '<h2>$1</h2>' },
            { pattern: /^# (.*$)/gim, replacement: '<h1>$1</h1>' },
            
            // Negrito e itálico
            { pattern: /\*\*\*(.*?)\*\*\*/g, replacement: '<strong><em>$1</em></strong>' },
            { pattern: /\*\*(.*?)\*\*/g, replacement: '<strong>$1</strong>' },
            { pattern: /\*(.*?)\*/g, replacement: '<em>$1</em>' },
            
            // Links
            { pattern: /\[(.*?)\]\((.*?)\)/g, replacement: '<a href="$2" target="_blank">$1</a>' },
            
            // Linha horizontal
            { pattern: /^---$/gim, replacement: '<hr>' },
            
            // Listas não ordenadas
            { pattern: /^\- (.*$)/gim, replacement: '<li>$1</li>' },
            
            // Blockquotes
            { pattern: /^> (.*$)/gim, replacement: '<blockquote>$1</blockquote>' },
            
            // Code inline
            { pattern: /`(.*?)`/g, replacement: '<code>$1</code>' }
        ];
    }

    parseTable(text) {
        const lines = text.split('\n');
        let inTable = false;
        let tableHtml = '';
        let result = '';
        
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            
            if (line.startsWith('|') && line.endsWith('|')) {
                if (!inTable) {
                    inTable = true;
                    tableHtml = '<table>';
                }
                
                const cells = line.split('|').filter(cell => cell.trim() !== '');
                
                // Pula linha separadora (---|---|)
                if (cells.every(cell => /^[-:]+$/.test(cell.trim()))) {
                    continue;
                }
                
                // Primeira linha é header
                if (inTable && tableHtml === '<table>') {
                    tableHtml += '<thead><tr>';
                    cells.forEach(cell => {
                        tableHtml += `<th>${cell.trim()}</th>`;
                    });
                    tableHtml += '</tr></thead><tbody>';
                } else {
                    tableHtml += '<tr>';
                    cells.forEach(cell => {
                        tableHtml += `<td>${cell.trim()}</td>`;
                    });
                    tableHtml += '</tr>';
                }
            } else {
                if (inTable) {
                    tableHtml += '</tbody></table>';
                    result += tableHtml;
                    tableHtml = '';
                    inTable = false;
                }
                result += line + '\n';
            }
        }
        
        if (inTable) {
            tableHtml += '</tbody></table>';
            result += tableHtml;
        }
        
        return result;
    }

    parseList(text) {
        // Processa listas não ordenadas
        const lines = text.split('\n');
        let inList = false;
        let result = '';
        
        for (const line of lines) {
            if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
                if (!inList) {
                    result += '<ul>\n';
                    inList = true;
                }
                result += line + '\n';
            } else if (line.trim().match(/^\d+\.\s/)) {
                if (!inList) {
                    result += '<ol>\n';
                    inList = true;
                } else if (result.includes('<ul>') && !result.endsWith('</ul>\n')) {
                    result += '</ul>\n<ol>\n';
                }
                result += line.replace(/^\d+\.\s/, '<li>') + '</li>\n';
            } else {
                if (inList) {
                    if (result.includes('<ul>') && !result.endsWith('</ul>\n')) {
                        result += '</ul>\n';
                    } else if (result.includes('<ol>') && !result.endsWith('</ol>\n')) {
                        result += '</ol>\n';
                    }
                    inList = false;
                }
                result += line + '\n';
            }
        }
        
        if (inList) {
            if (result.includes('<ul>') && !result.endsWith('</ul>\n')) {
                result += '</ul>';
            } else if (result.includes('<ol>') && !result.endsWith('</ol>\n')) {
                result += '</ol>';
            }
        }
        
        return result;
    }

    render(markdown) {
        if (!markdown) return '';
        
        let html = markdown;
        
        // Processa tabelas primeiro
        html = this.parseTable(html);
        
        // Aplica regras de substituição
        this.rules.forEach(rule => {
            html = html.replace(rule.pattern, rule.replacement);
        });
        
        // Processa listas
        html = this.parseList(html);
        
        // Converte quebras de linha em parágrafos
        html = html.split('\n\n')
            .map(paragraph => {
                paragraph = paragraph.trim();
                if (!paragraph) return '';
                
                // Não envolve em <p> se já for um elemento HTML
                if (paragraph.startsWith('<h') || 
                    paragraph.startsWith('<ul') || 
                    paragraph.startsWith('<ol') ||
                    paragraph.startsWith('<table') ||
                    paragraph.startsWith('<hr') ||
                    paragraph.startsWith('<blockquote')) {
                    return paragraph;
                }
                
                return `<p>${paragraph}</p>`;
            })
            .join('\n');
        
        return html;
    }
}

// Inicialização da página
document.addEventListener('DOMContentLoaded', async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const cardPath = urlParams.get('card');
    const cardName = urlParams.get('name');
    const isReversed = urlParams.get('reversed') === 'true';
    
    if (!cardPath) {
        showError();
        return;
    }
    
    try {
        await loadCard(cardPath, cardName, isReversed);
    } catch (error) {
        console.error('Erro ao carregar carta:', error);
        showError();
    }
});

// Carregar e exibir carta
async function loadCard(cardPath, cardName, isReversed = false) {
    const loading = document.getElementById('loading');
    const cardDisplay = document.getElementById('card-display');
    const errorDisplay = document.getElementById('error-display');
    
    try {
        // Determina os caminhos
        const descriptionPath = `../${cardPath}_description.md`;
        const imagePath = descriptionPath.replace('_description.md', '').replace(/\.md$/, '');
        
        // Tenta diferentes extensões de imagem
        const imageExtensions = ['.webp', '.png', '.jpg', '.jpeg'];
        let finalImagePath = '';
        
        for (const ext of imageExtensions) {
            const testPath = imagePath + ext;
            try {
                const response = await fetch(testPath, { method: 'HEAD' });
                if (response.ok) {
                    finalImagePath = testPath;
                    break;
                }
            } catch (e) {
                // Continua tentando
            }
        }
        
        // Se não encontrou, usa .webp como padrão
        if (!finalImagePath) {
            finalImagePath = imagePath + '.webp';
        }
        
        // Carrega a descrição
        const response = await fetch(descriptionPath);
        
        if (!response.ok) {
            throw new Error('Descrição não encontrada');
        }
        
        const markdownText = await response.text();
        
        // Renderiza o markdown
        const renderer = new MarkdownRenderer();
        const htmlContent = renderer.render(markdownText);
        
        // Atualiza a página
        const cardImage = document.getElementById('card-image');
        cardImage.src = finalImagePath;
        cardImage.alt = cardName || 'Carta do Tarot';
        
        // Aplica rotação se invertida
        if (isReversed) {
            cardImage.style.transform = 'rotate(180deg)';
        }
        
        // Adiciona indicador de invertida se necessário
        let contentHtml = htmlContent;
        if (isReversed) {
            contentHtml = `
                <div style="background: rgba(233, 69, 96, 0.15); border: 2px solid var(--accent); border-radius: 12px; padding: 1rem; margin-bottom: 1.5rem; text-align: center;">
                    <strong style="color: var(--accent); font-size: 1.2rem;">🔄 Carta Invertida</strong>
                    <p style="margin-top: 0.5rem; margin-bottom: 0;">Esta carta foi sorteada em posição invertida. Considere os aspectos de sombra, bloqueios ou energias diminuídas em sua interpretação.</p>
                </div>
            ` + contentHtml;
        }
        
        document.getElementById('card-info').innerHTML = contentHtml;
        
        // Atualiza o título da página
        const titleMatch = markdownText.match(/^#\s+(.+)$/m);
        const reversedSuffix = isReversed ? ' (Invertida)' : '';
        if (titleMatch) {
            document.title = `${titleMatch[1]}${reversedSuffix} • Tarot de Thoth`;
        } else if (cardName) {
            document.title = `${cardName}${reversedSuffix} • Tarot de Thoth`;
        }
        
        // Mostra o conteúdo
        loading.style.display = 'none';
        cardDisplay.style.display = 'block';
        
    } catch (error) {
        console.error('Erro:', error);
        showError();
    }
}

// Mostrar erro
function showError() {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('card-display').style.display = 'none';
    document.getElementById('error-display').style.display = 'block';
}
