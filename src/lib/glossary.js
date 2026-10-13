// Glossário de defeitos IRDR (catálogo traduzido PT-BR: processo, subprocesso, defeito e definição)
window.IRDR_GLOSSARY = [
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Tote Adjacente (Adjacent Tote)",
"definition": "O AA coletou o ASIN correto, mas retirou fisicamente de um tote adjacente ao tote indicado para a coleta."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "ASIN em Conjunto Separado (Bundled ASIN Separated)",
"definition": "O AA quebrou um conjunto (kit) durante a coleta ao retirar fisicamente apenas 1 unidade do pacote. As demais unidades ficaram na posição e passaram a ser contadas como sobra."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Falta Falsa na Coleta (False Pick Short)",
"definition": "O AA marcou a unidade como faltante durante a coleta. Isso exclui a unidade virtualmente do tote e gera uma contagem simples do tote para verificar a quantidade. Se a contagem simples não bater com o esperado virtualmente, é gerada uma contagem cíclica para verificar os ASINs do conteúdo físico. Se as contagens não forem concluídas a tempo, o item dado como faltante pode ser encontrado durante o IRDR."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até a coleta, mas o defeito específico não está listado ou é uma combinação de vários erros."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Coletado e Não Escaneado (Picked Not Scanned)",
"definition": "O coletor retira fisicamente a unidade, mas não a movimenta virtualmente. A unidade foi colocada no tote, mas não foi escaneada. *Diferente de coletar o ASIN errado do tote."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Outras unidades manuseadas durante a coleta ficam mal posicionadas. As unidades são devolvidas a um tote diferente daquele de onde vieram originalmente."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Escaneado e Não Coletado (Scanned Not Picked)",
"definition": "O coletor escaneia a unidade necessária, mas não a retira fisicamente. A unidade é devolvida fisicamente. *Diferente de coletar o ASIN errado do tote."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Violação de Etiqueta do Tote (Tote Etiquette Violation)",
"definition": "O AA deixou um item para fora do tote ou acima do suporte da cinta do tote, fazendo com que o item caísse e se tornasse anistia (amnesty)."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "ASIN Errado no Tote (Wrong ASIN from Tote)",
"definition": "O coletor é instruído a coletar uma ou mais unidades de um determinado ASIN. O defeito ocorre quando o coletor escaneia o ASIN correto, mas retira fisicamente unidades de um ASIN diferente. Isso cria uma divergência físico/virtual no tote."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "O coletor é instruído a coletar uma ou mais unidades de um determinado ASIN. O defeito ocorre quando o coletor retira mais ou menos que a quantidade especificada. Isso cria uma divergência físico/virtual no tote."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Processo de Coleta (Pick Process)",
"error": "Tote Errado (Wrong Tote)",
"definition": "O AA coletou o ASIN correto, mas retirou fisicamente de outro tote (não adjacente)."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "O resolvedor de problemas de Outbound (OB) adicionou o ASIN incorreto. Geralmente por violação da progressão de ASIN ou por um ASIN ambíguo com múltiplas vinculações que foi vinculado incorretamente no PopsUI."
},
{
"path": "Coleta AR (AR Pick TASRS)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado: Uso Indevido do Printmon (Wrong ASIN: Printmon Misuse)",
"definition": "Destaca defeitos/ajustes feitos durante o processo de contagem que ficaram incorretos porque o ASIN errado foi impresso e aplicado via Printmon."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Consolidado e Não Escaneado (Consolidated Not Scanned)",
"definition": "A unidade foi armazenada fisicamente no tote do IRDR (sem o escaneamento correspondente)."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até a Consolidação, mas não foi possível determinar uma causa raiz definitiva."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "Ocorre quando o consolidador escaneia e armazena incorretamente o ASIN errado, violando a hierarquia de ASIN."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Resolução de Problema (Problem Solve)",
"definition": "O defeito pode ser rastreado até a Resolução de Problemas da Consolidação, mas não foi possível determinar uma causa raiz definitiva."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "A unidade foi devolvida ou extraviada fisicamente DE ou PARA o tote do IRDR, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Escaneado e Não Consolidado (Scanned Not Consolidated)",
"definition": "A unidade foi movimentada virtualmente para o tote do IRDR (sem a movimentação física correspondente)."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "Aplica-se a cenários em AR Consolidate nos quais o item foi identificado como a causa mais provável do defeito de IRDR, mas não há evidências suficientes para identificar a causa raiz mais provável."
},
{
"path": "Consolidação (Consolidation)",
"area": "Consolidação AR (AR Consolidation)",
"error": "Tote Errado (Wrong Tote)",
"definition": "Aplica-se a cenários em que o consolidador escaneia o item virtualmente para um tote, mas o coloca fisicamente em um tote diferente."
},
{
"path": "Consolidação (Consolidation)",
"area": "Transferência em Lote (Bulk transfer)",
"error": "Anistia de Transferência em Lote (Bulk transfer Amnesty)",
"definition": "A unidade teve o ASIN adicionado fisicamente AO tote do IRDR, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Consolidação (Consolidation)",
"area": "Transferência em Lote (Bulk transfer)",
"error": "Sobra de Transferência em Lote (Bulk transfer overage)",
"definition": "A unidade foi consolidada fisicamente no tote do IRDR."
},
{
"path": "Consolidação (Consolidation)",
"area": "Transferência em Lote (Bulk transfer)",
"error": "Falta de Transferência em Lote (Bulk transfer Shortage)",
"definition": "A unidade foi consolidada virtualmente no tote do IRDR."
},
{
"path": "Consolidação (Consolidation)",
"area": "Transferência em Lote (Bulk transfer)",
"error": "ASIN Errado na Transferência em Lote (Bulk transfer Wrong Asin)",
"definition": "O ASIN errado foi adicionado virtualmente DE ou PARA o tote do IRDR, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Consolidação (Consolidation)",
"area": "Sparrow",
"error": "Consolidado e Não Escaneado (Consolidated Not Scanned)",
"definition": "A unidade foi armazenada fisicamente no tote do IRDR (sem o escaneamento correspondente)."
},
{
"path": "Consolidação (Consolidation)",
"area": "Sparrow",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até o Sparrow, mas não foi possível determinar uma causa raiz definitiva."
},
{
"path": "Consolidação (Consolidation)",
"area": "Sparrow",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "A unidade foi devolvida ou extraviada virtualmente DE ou PARA o tote do IRDR, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Consolidação (Consolidation)",
"area": "Sparrow",
"error": "Anistia Sparrow (Sparrow Amnesty)",
"definition": "O ASIN foi adicionado fisicamente AO tote do IRDR pelo Sparrow, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Consolidação (Consolidation)",
"area": "Sparrow",
"error": "Sobra Sparrow (Sparrow Overage)",
"definition": "A unidade foi armazenada fisicamente no tote do IRDR pelo Sparrow."
},
{
"path": "Consolidação (Consolidation)",
"area": "Sparrow",
"error": "Falta Sparrow (Sparrow Shortage)",
"definition": "A unidade foi armazenada virtualmente no tote do IRDR pelo Sparrow."
},
{
"path": "Consolidação (Consolidation)",
"area": "Sparrow",
"error": "ASIN Errado Sparrow (Sparrow Wrong ASIN)",
"definition": "O ASIN errado foi adicionado virtualmente DE ou PARA o tote do IRDR pelo Sparrow, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Posição Adjacente (Adjacent Bin)",
"definition": "O AA coletou o ASIN correto, mas retirou fisicamente de uma posição (bin) adjacente à indicada para a coleta."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "O AA deixou um item para fora da posição ou acima do suporte da cinta, fazendo com que o item caísse e se tornasse anistia (amnesty)."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "ASIN em Conjunto Separado (Bundled ASIN Separated)",
"definition": "O AA quebrou um conjunto (kit) durante a coleta ao retirar fisicamente apenas 1 unidade do pacote. As demais unidades ficaram na posição e passaram a ser contadas como sobra."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Falta Falsa na Coleta (False Pick Short)",
"definition": "O AA marcou a unidade como faltante durante a coleta. Isso exclui a unidade virtualmente da posição e gera uma contagem simples da posição para verificar a quantidade. Se a contagem simples não bater com o esperado virtualmente, é gerada uma contagem cíclica para verificar os ASINs do conteúdo físico. Se as contagens não forem concluídas a tempo, o item dado como faltante pode ser encontrado durante o IRDR."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até a coleta, mas o defeito específico não está listado ou é uma combinação de vários erros."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Outras unidades manuseadas durante a coleta ficam mal posicionadas. As unidades são devolvidas a qualquer posição da face do pod diferente daquela de onde vieram originalmente."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Escaneado e Não Coletado (Scanned Not Picked)",
"definition": "O coletor escaneia a unidade necessária, mas não a retira fisicamente. A unidade é devolvida fisicamente. *Diferente de coletar o ASIN errado da posição."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "ASIN Errado na Posição (Wrong ASIN from Bin)",
"definition": "O coletor é instruído a coletar uma ou mais unidades de um determinado ASIN. O defeito ocorre quando o coletor escaneia o ASIN correto, mas retira fisicamente unidades de um ASIN diferente. Isso cria uma divergência físico/virtual na posição."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Posição Errada (Wrong Bin)",
"definition": "O AA coletou o ASIN correto, mas retirou fisicamente de outra posição (não adjacente) na mesma face do pod indicada para a coleta."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Coleta (Pick Process)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "O coletor é instruído a coletar uma ou mais unidades de um determinado ASIN. O defeito ocorre quando o coletor retira mais ou menos que a quantidade especificada. Isso cria uma divergência físico/virtual na posição."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "O resolvedor de problemas adicionou o ASIN errado."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Manipulação Remota de Inventário (Manipulate Inventory Remotely)",
"definition": "Um resolvedor de problemas no módulo altera algo sobre o item sem tê-lo fisicamente em mãos. Isso pode resultar em uma troca de ASIN incorreta ou em ajustes de quantidade sem verificação."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Etiquetagem Incorreta: Interna (Mislabel: Internal)",
"definition": "Um resolvedor de problemas etiquetou o item incorretamente."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito do item se originou na Resolução de Problemas de Devoluções de Clientes, mas há múltiplas possibilidades e informação insuficiente para vinculá-lo diretamente a uma única origem."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Outro (Other)",
"definition": "O defeito foi rastreado até a Resolução de Problemas de Devoluções de Clientes; porém, a causa específica não está listada."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado: Uso Indevido do Printmon (Wrong ASIN: Printmon Misuse)",
"definition": "Destaca defeitos/ajustes feitos durante o processo de contagem que ficaram incorretos porque o ASIN errado foi impresso e aplicado via Printmon."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processamento de Devoluções (Returns Processing)",
"error": "Etiquetagem Incorreta: Interna (Mislabel: Internal)",
"definition": "Defeito de IRDR resultante de uma etiquetagem incorreta feita no processamento de devoluções, sendo o item posteriormente armazenado. O defeito é descoberto e corrigido durante a contagem de IRDR."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Posição Adjacente (Adjacent Bin)",
"definition": "O armazenador tenta guardar o item na posição indicada, mas ele não cabe após o escaneamento; então o item é colocado na posição adjacente. (Era um problema mais comum antes do IDS; quando a posição adjacente é selecionada, hoje costuma ser por predição de ML.)"
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até a armazenagem (stow), mas não foi possível determinar uma causa raiz definitiva."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "Ocorre quando o armazenador escaneia e guarda incorretamente o ASIN errado, violando a hierarquia de ASIN."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "A unidade foi devolvida ou extraviada fisicamente DE ou PARA a posição do IRDR, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Escaneado e Não Armazenado (Scanned Not Stowed)",
"definition": "A unidade foi movimentada virtualmente para a posição do IRDR, mas não fisicamente."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Armazenado e Não Escaneado (Stowed Not Scanned)",
"definition": "A unidade foi armazenada fisicamente na posição do IRDR, mas não virtualmente."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Itens Similares Armazenados como Um Único Registro (Stowed Similar Titles as One Record)",
"definition": "Aplica-se a cenários em que o armazenador escaneia repetidamente um único item para guardar várias unidades, sem perceber que na verdade não são todas do mesmo ASIN, mas sim ASINs semelhantes."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "Aplica-se a cenários em que a Armazenagem foi identificada como a causa mais provável do defeito de IRDR, mas não há evidências suficientes para identificar a causa raiz mais provável."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "ASIN Errado (Wrong ASIN)",
"definition": "Aplica-se a cenários em que o armazenador não segue a progressão de ASIN em um item com múltiplos códigos de barras escaneáveis, escaneando o código incorreto e armazenando o item sob o ASIN errado."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Posição Errada (Wrong Bin)",
"definition": "Aplica-se a cenários em que o armazenador escaneia o item virtualmente para uma posição, mas o coloca fisicamente em outra. Em prédios já em transição para o IDS, essa classificação é menos comum, pois o armazenador não escaneia de fato a posição indicada — normalmente é o próprio sistema IDS que registra a armazenagem na posição errada."
},
{
"path": "Devoluções de Clientes (Customer Returns)",
"area": "Processo de Armazenagem (Stow Process)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "Aplica-se a cenários com divergência entre a quantidade de unidades armazenadas fisicamente e a quantidade armazenada virtualmente. Inclui armazenagens de masterpack e de conjuntos quebrados (broken set)."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "Conjunto Quebrado (Broken Set)",
"definition": "Unidades foram recebidas incorretamente como conjuntos quebrados (broken sets)."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "Sobra na Decantação (Decant Overage)",
"definition": "A unidade foi armazenada fisicamente no tote do IRDR durante a decantação."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "Falta na Decantação (Decant Shortage)",
"definition": "A unidade foi armazenada virtualmente no tote do IRDR durante a decantação."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "ASIN Errado na Decantação (Decant Wrong ASIN)",
"definition": "O ASIN errado foi adicionado virtualmente AO tote do IRDR durante a decantação, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "Decantado e Não Escaneado (Decanted Not Scanned)",
"definition": "O item foi decantado fisicamente para o tote (sem o escaneamento correspondente)."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "Uma caixa é recebida com múltiplos códigos de barras. Um dos códigos está vinculado a um item unitário."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "Escaneado e Não Decantado (Scanned Not Decanted)",
"definition": "O item foi decantado virtualmente para o tote (sem a movimentação física correspondente)."
},
{
"path": "Decantação (Decant)",
"area": "Decantação AR (AR Decant)",
"error": "ASIN Errado (Wrong ASIN)",
"definition": "Aplica-se a cenários com divergência entre o ASIN recebido fisicamente e o ASIN recebido virtualmente."
},
{
"path": "Decantação (Decant)",
"area": "Software de Decantação AR (AR Decant Software)",
"error": "Sobra na Decantação (Decant Overage)",
"definition": "A unidade foi armazenada fisicamente no tote do IRDR durante a decantação."
},
{
"path": "Decantação (Decant)",
"area": "Software de Decantação AR (AR Decant Software)",
"error": "Falta na Decantação (Decant Shortage)",
"definition": "A unidade foi armazenada virtualmente no tote do IRDR durante a decantação."
},
{
"path": "Decantação (Decant)",
"area": "Software de Decantação AR (AR Decant Software)",
"error": "ASIN Errado na Decantação (Decant Wrong ASIN)",
"definition": "O ASIN errado foi adicionado virtualmente AO tote do IRDR durante a decantação, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Decantação (Decant)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "O resolvedor de problemas adicionou o ASIN errado."
},
{
"path": "Decantação (Decant)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Manipulação Remota de Inventário (Manipulate Inventory Remotely)",
"definition": "Defeito de IRDR resultante de manipulação incorreta do inventário no tote do IRDR por um resolvedor de problemas da Decantação."
},
{
"path": "Decantação (Decant)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Etiquetagem Incorreta: Interna (Mislabel: Internal)",
"definition": "Defeito de IRDR resultante de etiquetagem incorreta por um resolvedor de problemas da Decantação, sendo o item posteriormente armazenado em um tote. O defeito é descoberto e corrigido durante a contagem de IRDR."
},
{
"path": "Decantação (Decant)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito foi rastreado até a Resolução de Problemas da Decantação."
},
{
"path": "Decantação (Decant)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Outro (Other)",
"definition": "O defeito foi rastreado até a Resolução de Problemas da Decantação."
},
{
"path": "Remoção de Tote Vazio (Empty Tote Removal)",
"area": "Transferência em Lote ToteASRS (ToteASRS Bulk Transfer)",
"error": "Divergência na Transferência em Lote (Bulk Transfer Mismatch)",
"definition": "Transferência em lote de todo o inventário de um 'tote de origem tsX' para um 'tote de destino hcX' nas estações SAUS do ToteASRS. O tote de origem vazio é retirado da estação e o tote de destino cheio retorna a um pod. Nenhum escaneamento dos ASINs do inventário é realizado."
},
{
"path": "Externo (External)",
"area": "Catálogo (Catalog)",
"error": "Troca de ASIN (ASIN Flip)",
"definition": "Uma pessoa alterou virtualmente o ASIN de um item usando a ferramenta FcSku Flip, mas não reetiquetou o item nem garantiu que o código de barras do produto ficasse vinculado ao novo ASIN. Durante o IRDR, o contador escaneou um código de barras que não estava vinculado ao ASIN atualizado, fazendo com que a unidade fosse convertida do ASIN virtualmente presente na posição para o ASIN vinculado ao código escaneado."
},
{
"path": "Externo (External)",
"area": "Catálogo (Catalog)",
"error": "Página de Detalhes do Produto (Details Page)",
"definition": "Informação enganosa ou incorreta na página de detalhes do item leva ao processamento incorreto do item. (Ex.: o título do item sugere que se trata de uma unidade única, mas na verdade é um conjunto.)"
},
{
"path": "Externo (External)",
"area": "Catálogo (Catalog)",
"error": "Fusão FBA (FBA Merge)",
"definition": "O ASIN de um item é alterado pelo processo de fusão FBA (FBA Merge). Um defeito pode ocorrer quando: o item não foi reetiquetado antes da contagem de IRDR e o código de barras disponível não está vinculado ao ASIN atualizado — ao escanear esse código, a unidade é convertida de um ASIN para outro; ou quando o processo de fusão FBA falha em atualizar todas as unidades para o novo ASIN — ao escanear o código disponível, as unidades também são convertidas de um ASIN para outro."
},
{
"path": "Externo (External)",
"area": "Catálogo (Catalog)",
"error": "Seleção Incorreta de Código de Barras (Incorrect Barcode Selection)",
"definition": "Existem múltiplos ASINs vinculados ao mesmo código de barras. Durante o IRDR, o contador escaneia o código e é solicitado a escolher o ASIN correto do item. O defeito ocorre quando o contador seleciona um ASIN que não está virtualmente na posição, o que converte a unidade de um ASIN para outro."
},
{
"path": "Externo (External)",
"area": "Catálogo (Catalog)",
"error": "Vinculação (Linking)",
"definition": "O ASIN vinculado a um código de barras é alterado, mas o inventário virtual não é atualizado para o novo ASIN. Durante o IRDR, o contador escaneia o código, fazendo com que a unidade seja convertida para o ASIN atualmente vinculado a esse código."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "Erro do IDS (IDS Error)",
"definition": "O defeito pode ser associado a um erro de software dentro do sistema IDS."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "FCSku do LPN Trocado Incorretamente (LPN FCSku Incorrectly Flipped)",
"definition": "O software alterou o FCSku original associado ao item, sem que houvesse alteração no LPN efetivamente escaneado."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "Outro (Other)",
"definition": "O defeito é resultado de um erro de software que não pode ser associado nem ao operador TRON nem ao sistema IDS."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "Verificação de Item por Qualidade Perceptiva (Perceptive Quality Item Verification)",
"definition": "O defeito pode ser associado a um erro de software do sistema Watson Item Verification. Normalmente trata-se de um ajuste falso feito pelo Watson Item Verification que foi posteriormente revertido pela contagem. Não controlável pelo FC."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "Erro do Operador TRON (Tron Operator Error)",
"definition": "O defeito está ligado a um erro do operador TRON. Não controlável pelo FC."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "Watson SRC — Contagem Não Criada (Watson SRC - No Count Created (Datelot))",
"definition": "O SRC não é gerado quando a data de validade real do produto não corresponde à data informada no momento do recebimento das unidades."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "Watson SRC — Fluxo Ainda Não Concluído (Watson SRC - Workflow Not yet Complete)",
"definition": "Falta um item na posição do IRDR. Houve uma devolução de anistia (Amnesty) no mesmo módulo que gerou um SRC. A contagem cíclica do IRDR (CC) ocorre antes do SRC e exclui a unidade faltante antes que o SRC possa reportar a divergência de inventário, fazendo com que a devolução de anistia não seja reconciliada corretamente. Isso costuma acontecer quando o item é recuperado como anistia dentro de 24 horas da contagem cíclica do IRDR."
},
{
"path": "Externo (External)",
"area": "Software",
"error": "Watson SRC: Nenhum Defeito Encontrado (Watson SRC: No Defect Found)",
"definition": "SRCs foram gerados para devoluções de anistia, mas as posições foram contadas sem que nenhum defeito fosse encontrado — indício de falha no fluxo do algoritmo usado para identificar as possíveis localizações da anistia."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "Erro Oculto do Fornecedor (Concealed Vendor Error)",
"definition": "Unidades foram recebidas incorretamente devido a informações enganosas ou incorretas do fornecedor: o pallet foi empilhado de forma que gerou imprecisão no recebimento (camadas desiguais/inconsistentes); o fornecedor enviou caixas declaradas como ASIN único contendo múltiplos ASINs; ou o fornecedor forneceu dados incorretos para processos de recebimento automático (LP receive)."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "DC — Erro Oculto do Fornecedor (DC - Concealed Vendor Error)",
"definition": "Unidades foram recebidas em que o conteúdo físico não corresponde ao SSCC ou às informações de etiqueta fornecidas pelo fornecedor, e a divergência não pôde ser identificada pelos processos padrão de recebimento da Amazon. No contexto 1DC, isso inclui pallets recebidos automaticamente cujos dados de SSCC não correspondem ao conteúdo físico, sendo o erro descoberto apenas em contagens posteriores ou no IRDR."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "DC — Deslocamento (DC - Drift)",
"definition": "Defeito de IRDR causado pela movimentação de um item para dentro ou fora da posição, sem que a falha seja atribuível a um processo ou associado específico. Pode ocorrer por itens deslizando pelas frestas entre posições — especialmente em prateleiras tradicionais (como em sites TS/TNS ou posições de damageland) — ou por 'física estranha' (funky physics)."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "DC — Etiquetagem Incorreta: Fornecedor (DC - Mislabel: Vendor)",
"definition": "Ocorre quando um item é etiquetado incorretamente por um vendedor ou fornecedor antes de chegar ao FC. Um item é considerado mal etiquetado se o ASIN na etiqueta não corresponder ao item físico — como cor, modelo ou quantidade de pacote errados —, desde que não haja nada fisicamente errado com o item causado por um processo da Amazon. Este termo consolida as antigas categorias 'Mislabel: External' e 'Mislabel: Seller/Vendor'. Etiquetas de fornecedor são quaisquer etiquetas não Amazon, incluindo as impressas diretamente na embalagem."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "DC — Múltiplas Possibilidades (DC - Multiple Possibilities)",
"definition": "A causa raiz exata não pôde ser identificada devido à possibilidade de múltiplos processos e/ou problemas causando o defeito."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "Etiquetagem Incorreta: Externa (Mislabel: External)",
"definition": "Ocorre quando um fornecedor etiqueta um item incorretamente, sendo posteriormente ajustado pelas contagens de IRDR. Um item é considerado mal etiquetado se o ASIN na etiqueta não corresponder ao item físico — como cor, modelo ou quantidade de pacote errados —, desde que não haja nada fisicamente errado com o item, como ser um masterpack ou conjunto quebrado. Etiquetas de fornecedor são quaisquer etiquetas não Amazon."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "Etiquetagem Incorreta: Vendedor/Fornecedor (Mislabel: Seller/Vendor)",
"definition": "Ocorre quando um item é etiquetado incorretamente por um vendedor ou fornecedor. Um item é considerado mal etiquetado se o ASIN na etiqueta não corresponder ao item físico — como cor, modelo ou quantidade de pacote errados —, desde que nada fisicamente errado com o item tenha sido causado por um processo da Amazon, como ser armazenado como masterpack ou conjunto quebrado. Etiquetas de vendedor/fornecedor têm tamanho diferente das etiquetas padrão da Amazon ou podem ser impressas diretamente na embalagem do item."
},
{
"path": "Externo (External)",
"area": "Fornecedor (Vendor)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito foi causado por erros relacionados ao fornecedor que não se encaixam em nenhuma outra categoria ou não podem ser determinados com certeza."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Anistia (Amnesty)",
"error": "Devolução (Addback) Não Escaneada (Addback Not Scanned)",
"definition": "Defeito causado por coleta AFM quando uma unidade caída é colocada em uma posição aleatória em vez de seguir o processo padrão de devolução (addback)."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Anistia (Amnesty)",
"error": "Adicionado ao Andar/Módulo Errado (Added to Wrong Floor/Mod)",
"definition": "Defeito de IRDR resultante da devolução de uma unidade de anistia usando o local de referência errado (andar/módulo/estação). Ao não usar o modo correto (estação x andar) e/ou a posição/estação de referência correta, o sistema gera contagens de SRC para posições erradas, ou nenhuma contagem é gerada. Como resultado, a posição de origem real da unidade de anistia não é localizada pelo fluxo de SRC, deixando essa posição com uma divergência físico/virtual que só é descoberta na contagem de IRDR."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Anistia (Amnesty)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "Defeito de IRDR resultante da devolução de uma unidade de anistia sob o ASIN errado (normalmente por não seguir a progressão de ASIN). Por isso, o item fica virtualmente na posição sob um código de barras de prioridade inferior, sendo o defeito descoberto e corrigido durante a contagem de IRDR."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Anistia (Amnesty)",
"error": "Anistia Não Processada Antes da Contagem (Amnesty Not Processed Before Count)",
"definition": "Defeito de IRDR resultante de uma unidade de anistia não devolvida antes da contagem de IRDR. Costuma ocorrer quando um item cai de uma posição poucos dias, ou até horas, antes da contagem — ou até mesmo durante ela; o atraso no processamento da anistia também pode ser causado por baixo efetivo na saúde do piso (floor health) ou pelo item estar em um local não verificado nas varreduras regulares. Como a anistia ainda não foi processada, a divergência físico/virtual na posição do IRDR não é corrigida antes da contagem. Este defeito só deve ser usado quando puder ser diretamente vinculado a um AA que não seguiu o procedimento padrão de trabalho de anistia."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Anistia (Amnesty)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Anistia (Amnesty)",
"error": "Cancelamento das Contagens Restantes (Cancelling Remaining Counts)",
"definition": "Mesmo ASIN encontrado em outra posição por meio de SRC."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Anistia (Amnesty)",
"error": "Nenhuma Contagem Gerada Após a Devolução (No Count Generated After Addback)",
"definition": "Defeito de IRDR que ocorre quando o fluxo de SRC de uma devolução de anistia falha em gerar posições candidatas para contagem. A causa mais comum é a divergência de datelot (a data de validade informada para o item de anistia difere das dos itens virtualmente na posição). Como nenhum SRC é concluído para corrigir a divergência físico/virtual da posição de origem do item de anistia, o defeito permanece sem ser descoberto até a contagem de IRDR."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "DC — Troca de ASIN (DC - ASIN Flip)",
"definition": "O contador registra o ASIN errado durante uma contagem cíclica, fazendo com que o inventário seja trocado entre dois ASINs. O item físico permanece inalterado, mas o registro virtual é atualizado incorretamente para um ASIN diferente."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "ICQA — Contagem com ASIN Errado (ICQA - Count Wrong ASIN)",
"definition": "O contador registrou um ASIN incorreto de acordo com a progressão de ASIN. Por exemplo, contou um UPC quando havia um LPN presente no item."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "Itens de Outras Posições Escaneados (Items From Other Bins Scanned)",
"definition": "O defeito resultou do contador processar unidades de outra posição durante a contagem."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "Quantidade Contada Incorretamente (Miscounted Quantity)",
"definition": "O defeito resultou do contador apurar uma quantidade incorreta, sem ser um erro de digitação — por exemplo, ao fazer contas erradas em um pallet, deixar de contar unidades na posição ou tratar ASINs parecidos como um único ASIN."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "O defeito resultou do contador processar um código de barras/ASIN quando outro código de barras, de prioridade superior na hierarquia de progressão de ASIN, também estava presente — por exemplo, dar baixa em um X00 e contar entrada como UPC."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "Erro de Etiqueta de Pallet ou Caixa (Pallet or Case Label Error)",
"definition": "O defeito resultou do contador escanear a etiqueta errada do pallet ao contar na Pallet Land."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Item colocado fisicamente na posição errada ao ser devolvido à Localização Prime por um contador de contagem cíclica (CC)."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica IRDR (IRDR Cycle Count)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "O defeito foi rastreado até uma contagem cíclica; porém, a causa específica não está listada."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "ICQA — Contagem com ASIN Errado (ICQA - Count Wrong ASIN)",
"definition": "O contador registrou um ASIN incorreto de acordo com a progressão de ASIN. Por exemplo, contou um UPC quando havia um LPN presente no item."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "Itens de Outras Posições Escaneados (Items From Other Bins Scanned)",
"definition": "O defeito resultou do contador processar unidades de outra posição durante a contagem."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "Quantidade Contada Incorretamente (Miscounted Quantity)",
"definition": "O defeito resultou do contador apurar uma quantidade incorreta, sem ser um erro de digitação — por exemplo, ao fazer contas erradas em um pallet, deixar de contar unidades na posição ou tratar ASINs parecidos como um único ASIN."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "O defeito resultou do contador processar um código de barras/ASIN quando outro código de barras, de prioridade superior na hierarquia de progressão de ASIN, também estava presente — por exemplo, dar baixa em um X00 e contar entrada como UPC."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "Erro de Etiqueta de Pallet ou Caixa (Pallet or Case Label Error)",
"definition": "O defeito resultou do contador escanear a etiqueta errada do pallet ao contar na Pallet Land."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Item colocado fisicamente na posição errada ao ser devolvido à Localização Prime por um contador de contagem cíclica (CC)."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Cíclica Não-IRDR (Non IRDR Cycle Count)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "O defeito foi rastreado até uma contagem cíclica; porém, a causa específica não está listada."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "Ocorre quando um resolvedor de problemas de ICQA adiciona o ASIN errado ao inventário, sendo corrigido posteriormente pelas contagens de IRDR. O ASIN pode ser adicionado diretamente à posição pelo resolvedor de problemas ou a um contêiner que é movido ou armazenado posteriormente na posição. Um ASIN adicionado é considerado errado se não corresponder ao item físico — como cor, modelo ou quantidade de pacote errados —, desde que não haja nada fisicamente errado com o item, como ser masterpack ou conjunto quebrado. Também pode ocorrer quando o resolvedor de problemas não segue a progressão de ASIN, como adicionar a unidade sob o B00 quando há um X00-Label correto no produto."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Manipulação Remota de Inventário (Manipulate Inventory Remotely)",
"definition": "Ocorre quando um resolvedor de problemas de ICQA faz alterações virtuais no inventário de uma posição sem verificar fisicamente essas alterações, causando uma divergência físico/virtual corrigida durante as contagens de IRDR. O erro pode ser causado por adicionar, excluir ou mover inventário virtualmente, ou por trocar um ASIN por outro sem verificar se o código de barras ou as etiquetas do item físico correspondem corretamente ao novo ASIN."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Etiquetagem Incorreta: Interna (Mislabel: Internal)",
"definition": "Ocorre quando um resolvedor de problemas de ICQA etiqueta um item incorretamente, sendo posteriormente ajustado pelas contagens de IRDR. Um item é considerado mal etiquetado se o ASIN na etiqueta não corresponder ao item físico — como cor, modelo ou quantidade de pacote errados —, desde que não haja nada fisicamente errado com o item, como ser masterpack ou conjunto quebrado. Também pode ocorrer quando o resolvedor de problemas não segue a progressão de ASIN, como cobrir ou remover um X00-Label correto com um B00-Label ao processar itens com múltiplos códigos escaneáveis. Itens mal etiquetados pela Amazon usam etiquetas padrão Amazon para se diferenciar da etiquetagem incorreta de vendedor/fornecedor."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Item colocado fisicamente na posição errada ao ser devolvido à Localização Prime pela Resolução de Problemas."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "Erro de uso geral para um defeito causado por um resolvedor de problemas de ICQA que não se encaixa em nenhuma outra categoria, ou quando o defeito é provavelmente atribuível a esse resolvedor de problemas, mas a causa raiz específica não pode ser determinada com certeza."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Simples de Posição (Simple Bin Count)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Simples de Posição (Simple Bin Count)",
"error": "Quantidade Contada Incorretamente (Miscounted Quantity)",
"definition": "O AA inseriu um número incorreto de um determinado registro ao realizar a contagem da posição."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Simples de Posição (Simple Bin Count)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Item colocado fisicamente na posição errada ao ser devolvido à Localização Prime por um contador de Contagem Simples de Posição (SBC)."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Simples de Registro (Simple Record Count)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Simples de Registro (Simple Record Count)",
"error": "Itens Similares Contados como Um Único Registro (Counted Similar Titles as One Record)",
"definition": "O AA de SRC escaneou uma unidade e contou em massa várias unidades semelhantes que pareciam ser iguais, mas na realidade eram ASINs diferentes."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Simples de Registro (Simple Record Count)",
"error": "Quantidade Contada Incorretamente (Miscounted Quantity)",
"definition": "O defeito não foi identificado antes da contagem de IRDR porque um contador de SRC contou a posição incorretamente antes da contagem cíclica do IRDR. Exemplo: um item cai da posição e é devolvido como anistia. A devolução de anistia gera um SRC e a posição do IRDR é contada. Há fisicamente 1 unidade na posição, mas o contador de SRC registra 2. A devolução de anistia não é reconciliada com o item faltante, pois o sistema não reflete a falta."
},
{
"path": "Controle de Inventário (Inventory Control)",
"area": "Contagem Simples de Registro (Simple Record Count)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Item colocado fisicamente na posição errada ao ser devolvido à Localização Prime por um contador de SRC (Contagem Simples de Registro)."
},
{
"path": "Embalagem/Expedição (Outbound Packing/Shipping)",
"area": "Processo de Indução (Induct Process)",
"error": "ASIN Errado (Wrong ASIN)",
"definition": "O indutor deu entrada de sobra sob o ASIN errado durante a indução, que foi então armazenado como devolução de Outbound (OB Putback) sob esse mesmo ASIN incorreto."
},
{
"path": "Embalagem/Expedição (Outbound Packing/Shipping)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "Um item que estava no inventário sob o ASIN correto é coletado e enviado para o Outbound, onde é marcado como faltante na Indução ou na Embalagem e devolvido ao inventário pela Resolução de Problemas de OB sob o ASIN incorreto, mesmo tendo apenas um único código de barras e não sendo um MSB."
},
{
"path": "Embalagem/Expedição (Outbound Packing/Shipping)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado: MSB (Added Wrong ASIN: MSB)",
"definition": "Um item que estava no inventário sob o ASIN correto é coletado e enviado para o Outbound, onde é marcado como faltante na Indução ou na Embalagem e devolvido ao inventário pela Resolução de Problemas de OB sob o ASIN errado, devido à existência de múltiplos códigos de barras vinculados a ASINs diferentes (erro de MSB)."
},
{
"path": "Embalagem/Expedição (Outbound Packing/Shipping)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Manipulação Remota de Inventário (Manipulate Inventory Remotely)",
"definition": "O resolvedor de problemas de Outbound excluiu um item de uma posição sem ir até o módulo e chamar o pod para confirmar que o item não estava fisicamente presente; o item acaba sendo devolvido à posição durante a contagem de IRDR."
},
{
"path": "Embalagem/Expedição (Outbound Packing/Shipping)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Etiquetagem Incorreta: Interna (Mislabel: Internal)",
"definition": "Um item foi armazenado na posição do IRDR sob o ASIN incorreto. O item foi adicionado ao tote de armazenagem pela Resolução de Problemas de Outbound após ter sido reetiquetado incorretamente por essa mesma equipe."
},
{
"path": "Embalagem/Expedição (Outbound Packing/Shipping)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito do item se originou na Resolução de Problemas de Outbound, mas há múltiplas possibilidades e informação insuficiente para vinculá-lo diretamente a uma única origem."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Posição Adjacente (Adjacent Bin)",
"definition": "O AA coletou o ASIN correto, mas retirou fisicamente de uma posição (bin) adjacente à indicada para a coleta."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "O AA deixou um item para fora da posição ou acima do suporte da cinta, fazendo com que o item caísse e se tornasse anistia (amnesty)."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "ASIN em Conjunto Separado (Bundled ASIN Separated)",
"definition": "O AA quebrou um conjunto (kit) durante a coleta ao retirar fisicamente apenas 1 unidade do pacote. As demais unidades ficaram na posição e passaram a ser contadas como sobra."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Erro: Fluxo de Pod Vazio (Error: Pod Empty Workflow)",
"definition": "Unidades de pods são transferidas para totes e depois injetadas no piso AR do TASRS. Os defeitos podem incluir unidades faltantes que já haviam sido transferidas, ou unidades encontradas que não estavam virtualmente na posição do pod."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Falta Falsa na Coleta (False Pick Short)",
"definition": "O AA marcou a unidade como faltante durante a coleta. Isso exclui a unidade virtualmente da posição e gera uma contagem simples da posição para verificar a quantidade. Se a contagem simples não bater com o esperado virtualmente, é gerada uma contagem cíclica para verificar os ASINs do conteúdo físico. Se as contagens não forem concluídas a tempo, o item dado como faltante pode ser encontrado durante o IRDR."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até a coleta, mas o defeito específico não está listado ou é uma combinação de vários erros."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Coletado e Não Escaneado (Picked Not Scanned)",
"definition": "O coletor retira fisicamente a unidade, mas não a movimenta virtualmente. A unidade foi colocada no tote, mas não foi escaneada. *Diferente de coletar o ASIN errado da posição."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Outras unidades manuseadas durante a coleta ficam mal posicionadas. As unidades são devolvidas a qualquer posição da face do pod diferente daquela de onde vieram originalmente."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Escaneado e Não Coletado (Scanned Not Picked)",
"definition": "O coletor escaneia a unidade necessária, mas não a retira fisicamente. A unidade é devolvida fisicamente. *Diferente de coletar o ASIN errado da posição."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "ASIN Errado na Posição (Wrong ASIN from Bin)",
"definition": "O coletor é instruído a coletar uma ou mais unidades de um determinado ASIN. O defeito ocorre quando o coletor escaneia o ASIN correto, mas retira fisicamente unidades de um ASIN diferente. Isso cria uma divergência físico/virtual na posição."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Posição Errada (Wrong Bin)",
"definition": "O AA coletou o ASIN correto, mas retirou fisicamente de outra posição (não adjacente) na mesma face do pod indicada para a coleta."
},
{
"path": "Coleta (Pick)",
"area": "Processo de Coleta (Pick Process)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "O coletor é instruído a coletar uma ou mais unidades de um determinado ASIN. O defeito ocorre quando o coletor retira mais ou menos que a quantidade especificada. Isso cria uma divergência físico/virtual na posição."
},
{
"path": "Coleta (Pick)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "O resolvedor de problemas de Outbound (OB) adicionou o ASIN incorreto. Geralmente por violação da progressão de ASIN ou por um ASIN ambíguo com múltiplas vinculações que foi vinculado incorretamente no PopsUI."
},
{
"path": "Coleta (Pick)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado: Uso Indevido do Printmon (Wrong ASIN: Printmon Misuse)",
"definition": "Destaca defeitos/ajustes feitos durante o processo de contagem que ficaram incorretos porque o ASIN errado foi impresso e aplicado via Printmon."
},
{
"path": "Recebimento (Receive)",
"area": "Caixa/Pallet (Case/Pallet)",
"error": "Conjunto Quebrado (Broken Set)",
"definition": "Unidades foram recebidas incorretamente como conjuntos quebrados (broken sets)."
},
{
"path": "Recebimento (Receive)",
"area": "Caixa/Pallet (Case/Pallet)",
"error": "ASIN Errado (Wrong ASIN)",
"definition": "Aplica-se a cenários com divergência entre o ASIN recebido fisicamente e o ASIN recebido virtualmente."
},
{
"path": "Recebimento (Receive)",
"area": "Caixa/Pallet (Case/Pallet)",
"error": "Pallet Misto (Mixed Pallet)",
"definition": "Um pallet com múltiplos ASINs é recebido como se contivesse apenas um ASIN. O pallet é então armazenado como pallet único sob esse ASIN. A contagem de IRDR encontra o(s) ASIN(s) adicional(is) no pallet."
},
{
"path": "Recebimento (Receive)",
"area": "Caixa/Pallet (Case/Pallet)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "Uma caixa é recebida com múltiplos códigos de barras. Um código está vinculado a um item unitário e o outro, a um conjunto. Ambos os ASINs existem no sistema, resultando em trocas de ASIN dependendo de qual código é escaneado."
},
{
"path": "Recebimento (Receive)",
"area": "Caixa/Pallet (Case/Pallet)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "Aplica-se a cenários com divergência entre a quantidade de unidades recebidas fisicamente e a quantidade recebida virtualmente."
},
{
"path": "Recebimento (Receive)",
"area": "Manuseio de Pallet (Pallet Handling)",
"error": "DC — Quantidade Incorreta no Desempilhamento (DC - Downstacked Incorrect Quantity)",
"definition": "Caixas desempilhadas do pallet de origem, mas com o número de caixas movidas incorreto, gerando quantidades erradas em um dos dois pallets."
},
{
"path": "Recebimento (Receive)",
"area": "Manuseio de Pallet (Pallet Handling)",
"error": "DC — Desempilhado Fisicamente, Não Virtualmente (DC - Downstacked Physically, Not Virtually)",
"definition": "Caixas ou pallets foram removidos fisicamente do pallet, mas não foram escaneados nem registrados no sistema, resultando em uma divergência de inventário: as unidades físicas existem em um local, mas não são rastreadas virtualmente ali."
},
{
"path": "Recebimento (Receive)",
"area": "Manuseio de Pallet (Pallet Handling)",
"error": "DC — Desempilhado Virtualmente, Não Fisicamente (DC - Downstacked Virtually, Not Physically)",
"definition": "Caixas ou pallets foram marcados como recebidos/desempilhados no sistema, mas não foram fisicamente removidos do pallet, resultando em inventário fantasma: o sistema mostra unidades disponíveis em um local, mas elas ainda estão fisicamente no pallet de origem."
},
{
"path": "Recebimento (Receive)",
"area": "Manuseio de Pallet (Pallet Handling)",
"error": "DC — Divergência entre Etiqueta e ASIN (DC - Tag-ASIN Mismatch)",
"definition": "A etiqueta (tag) aplicada a um pallet não corresponde ao ASIN do conteúdo físico, ou uma divergência de ASIN é descoberta durante o desempilhamento. Pode ocorrer por etiquetagem incorreta no recebimento ou troca de etiquetas entre pallets."
},
{
"path": "Recebimento (Receive)",
"area": "Entrada PID (PID Input)",
"error": "DC — csX Duplicado Criado (DC - Duplicate csX Created)",
"definition": "Uma etiqueta csX foi impressa duas vezes devido a uma etiqueta original ausente ou danificada, resultando em registros de processamento duplicados. Isso cria divergências de inventário quando o mesmo inventário físico é rastreado sob dois registros virtuais."
},
{
"path": "Recebimento (Receive)",
"area": "Entrada PID (PID Input)",
"error": "DC — Etiquetas frX Incorretas (DC - Incorrect frX Labels)",
"definition": "Etiquetas frX foram impressas incorretamente, movidas de seu pallet original, ou a etiqueta original estava ausente antes do processamento de PID. Isso causa erros posteriores de PID quando o sistema tenta processar o inventário com dados de etiqueta incorretos."
},
{
"path": "Recebimento (Receive)",
"area": "Processamento PID (PID Processing)",
"error": "DC — ASIN/Quantidade/PO Errados (DC - Wrong ASIN-Quantity-PO)",
"definition": "O PID processou o inventário para um local, quantidade ou pedido de compra incorreto devido a erros de etiquetagem do fornecedor ou problemas de etiqueta. Resulta em inventário atribuído virtualmente ao ASIN errado, à quantidade errada ou à linha de PO errada."
},
{
"path": "Recebimento (Receive)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "Defeito de IRDR resultante de um resolvedor de problemas de Recebimento ajustando o ASIN errado, geralmente por não seguir a progressão de ASIN. Como resultado, o(s) item(ns) fica(m) na posição sob um ASIN de prioridade inferior, sendo o registro corrigido pela contagem de IRDR para o ASIN de prioridade superior."
},
{
"path": "Recebimento (Receive)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Manipulação Remota de Inventário (Manipulate Inventory Remotely)",
"definition": "Defeito de IRDR resultante de manipulação incorreta do inventário na posição do IRDR por um resolvedor de problemas de Recebimento, deixando uma divergência físico/virtual que é corrigida durante a contagem de IRDR."
},
{
"path": "Recebimento (Receive)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Etiquetagem Incorreta: Interna (Mislabel: Internal)",
"definition": "Defeito de IRDR resultante de etiquetagem incorreta por um resolvedor de problemas de Recebimento, sendo o item posteriormente armazenado em uma posição. O defeito é descoberto e corrigido durante a contagem de IRDR."
},
{
"path": "Recebimento (Receive)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito foi rastreado até a Resolução de Problemas de Recebimento; porém, a causa exata não pôde ser determinada."
},
{
"path": "Recebimento (Receive)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Outro (Other)",
"definition": "O defeito foi rastreado até a Resolução de Problemas de Recebimento; porém, a causa específica não está listada."
},
{
"path": "Recebimento (Receive)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Reabastecimento em Local Errado (Replenishment Wrong Location)",
"definition": "O defeito foi causado pela Resolução de Problemas de Recebimento ao processar unidades de reabastecimento em um local incorreto usando as ferramentas de resolução de problemas."
},
{
"path": "Recebimento (Receive)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado: Uso Indevido do Printmon (Wrong ASIN: Printmon Misuse)",
"definition": "Destaca defeitos/ajustes feitos durante o processo de contagem que ficaram incorretos porque o ASIN errado foi impresso e aplicado via Printmon."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Posição Adjacente (Adjacent Bin)",
"definition": "Tentou-se armazenar o pallet na posição de RSR, mas foi escaneada a etiqueta de posição errada."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O pallet apresenta múltiplos erros, nenhum dos quais pode ser diretamente atribuído a uma causa raiz específica."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Outra Posição Escaneada (Other Bin Scanned)",
"definition": "Tentou-se armazenar o pallet na posição de RSR, mas foi escaneada a etiqueta de outra posição."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Reabastecido Fisicamente, Não Virtualmente (Replenished Physically, Not Virtually)",
"definition": "Unidades foram reabastecidas fisicamente, mas não constavam virtualmente no local em que foram fisicamente reabastecidas."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Reabastecido Virtualmente, Não Fisicamente (Replenished Virtually, Not Physically.)",
"definition": "Unidades foram reabastecidas virtualmente, mas não estavam fisicamente no local em que foram virtualmente reabastecidas."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Escaneado e Não Armazenado (Scanned Not Stowed)",
"definition": "O pallet foi armazenado virtualmente no RSR, mas não foi armazenado fisicamente no local."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Armazenado e Não Escaneado (Stowed Not Scanned)",
"definition": "O pallet foi armazenado fisicamente no RSR, mas não foi armazenado virtualmente no local."
},
{
"path": "Estoque (Stock (RSR))",
"area": "Processo de Estoque (Stock Process (RSR))",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "Determinou-se que o erro foi causado por alguém no RSR, mas não foi possível identificar a causa raiz específica."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Posição Adjacente (Adjacent Bin)",
"definition": "O armazenador tenta guardar o item na posição indicada, mas ele não cabe após o escaneamento; então o item é colocado na posição adjacente. (Era um problema mais comum antes do IDS; quando a posição adjacente é selecionada, hoje costuma ser por predição de ML.)"
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até a armazenagem (stow), mas não foi possível determinar uma causa raiz definitiva."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "Ocorre quando o armazenador escaneia e guarda incorretamente o ASIN errado, violando a hierarquia de ASIN."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "A unidade foi devolvida ou extraviada fisicamente DE ou PARA a posição do IRDR, resultando em uma unidade FALTANTE ou ENCONTRADA."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Escaneamento Rápido (Rapid Scan)",
"definition": "Ocorre quando o associado armazena 2 itens em 1,25 segundo, fazendo com que o IDS registre apenas uma única armazenagem. Anteriormente categorizado como Machine Gun Stow."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Escaneado e Não Armazenado (Scanned Not Stowed)",
"definition": "A unidade foi movimentada virtualmente para a posição do IRDR, mas não fisicamente."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Armazenado e Não Escaneado (Stowed Not Scanned)",
"definition": "A unidade foi armazenada fisicamente na posição do IRDR, mas não virtualmente."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Itens Similares Armazenados como Um Único Registro (Stowed Similar Titles as One Record)",
"definition": "Aplica-se a cenários em que o armazenador escaneia repetidamente um único item para guardar várias unidades, sem perceber que na verdade não são todas do mesmo ASIN, mas sim ASINs semelhantes."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "UIO: Sobra Inesperada de Item (UIO: Unexpected Item Overage)",
"definition": "Sobra de item causada por uma quantidade maior de um item do que a esperada ou registrada no sistema de gestão de inventário."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "Aplica-se a cenários em que a Armazenagem foi identificada como a causa mais provável do defeito de IRDR, mas não há evidências suficientes para identificar a causa raiz mais provável."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "ASIN Errado (Wrong ASIN)",
"definition": "Aplica-se a cenários em que o armazenador não segue a progressão de ASIN em um item com múltiplos códigos de barras escaneáveis, escaneando o código incorreto e armazenando o item sob o ASIN errado."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Posição Errada (Wrong Bin)",
"definition": "Aplica-se a cenários em que o armazenador escaneia o item virtualmente para uma posição, mas o coloca fisicamente em outra. Em prédios já em transição para o IDS, essa classificação é menos comum, pois o armazenador não escaneia de fato a posição indicada — normalmente é o próprio sistema IDS que registra a armazenagem na posição errada."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem Unitária (Each Stow)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "Aplica-se a cenários fora da armazenagem por quantidade (quantity stow) em que há divergência entre a quantidade de unidades armazenadas fisicamente e a armazenada virtualmente. Inclui armazenagens de masterpack e de conjuntos quebrados (broken set)."
},
{
"path": "Armazenagem (Stow)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado (Added Wrong ASIN)",
"definition": "Um resolvedor de problemas de Inbound no módulo adiciona o item a um tote sob o ASIN incorreto, levando à armazenagem sob o ASIN errado. Difere do erro de MSB porque, neste caso, não há múltiplos códigos de barras — provavelmente trata-se de um item sem código de barras escaneável passando pela Resolução de Problemas. Se o item não for devidamente pesquisado antes de ser devolvido, há risco de ser devolvido sob o ASIN errado."
},
{
"path": "Armazenagem (Stow)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado Adicionado: MSB (Added Wrong ASIN: MSB)",
"definition": "Um resolvedor de problemas de Inbound no módulo adiciona o item a um tote sob o ASIN incorreto, levando à armazenagem sob o ASIN errado. Neste caso, o item possui múltiplos códigos de barras vinculados a ASINs diferentes, como um item de fornecedor com UPC e X00-Label. Se a progressão de ASIN correta não for seguida, o item será armazenado sob um ASIN de prioridade inferior."
},
{
"path": "Armazenagem (Stow)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Manipulação Remota de Inventário (Manipulate Inventory Remotely)",
"definition": "Um resolvedor de problemas de Inbound no módulo altera algo sobre o item sem tê-lo fisicamente em mãos. Isso pode resultar em uma troca de ASIN incorreta ou em ajustes de quantidade sem verificação."
},
{
"path": "Armazenagem (Stow)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Etiquetagem Incorreta: Interna (Mislabel: Internal)",
"definition": "Um resolvedor de problemas de Inbound etiquetou o item incorretamente."
},
{
"path": "Armazenagem (Stow)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Item colocado fisicamente na posição errada ao ser devolvido à Localização Prime por um resolvedor de problemas de Inbound (IB)."
},
{
"path": "Armazenagem (Stow)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "ASIN Errado: Uso Indevido do Printmon (Wrong ASIN: Printmon Misuse)",
"definition": "Destaca defeitos/ajustes feitos durante o processo de contagem que ficaram incorretos porque o ASIN errado foi impresso e aplicado via Printmon."
},
{
"path": "Armazenagem (Stow)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "Um resolvedor de problemas de Inbound no módulo realiza uma transação com a quantidade processada incorreta. Na maioria das vezes isso ocorre por itens em masterpack (por exemplo, 6 unidades adicionadas como 1 unidade) ou em conjunto quebrado (um conjunto de 6 adicionado como 6 unidades individuais em vez de 1 conjunto). Se o armazenador não identificar o erro de quantidade, as unidades também serão armazenadas com a quantidade errada."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem por Quantidade (Quantity Stow)",
"error": "Violação de Etiqueta da Posição (Bin Etiquette Violation)",
"definition": "Não seguir o padrão de trabalho correto, afetando a qualidade da posição. Inclui não seguir o fluxo de peça única, armazenar em tamanho de posição incorreto, deixar itens para fora, guardar produtos parecidos na mesma posição, superlotar a posição, entre outros."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem por Quantidade (Quantity Stow)",
"error": "Múltiplas Posições (Multiple Bins)",
"definition": "Itens colocados em múltiplas posições após o escaneamento de um item, sendo armazenados fisicamente em posições diferentes daquela selecionada durante a Armazenagem por Quantidade (Quantity Stow)."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem por Quantidade (Quantity Stow)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "O defeito pode ser rastreado até a armazenagem (stow), mas não foi possível determinar uma causa raiz definitiva."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem por Quantidade (Quantity Stow)",
"error": "Múltiplos Códigos de Barras Escaneáveis (Multiple Scannable Barcodes)",
"definition": "Ocorre quando o armazenador escaneia e guarda incorretamente o ASIN errado, violando a hierarquia de ASIN."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem por Quantidade (Quantity Stow)",
"error": "ASIN Errado (Wrong ASIN)",
"definition": "Múltiplos ASINs armazenados após o escaneamento de um item, levando a itens armazenados fisicamente, mas não virtualmente."
},
{
"path": "Armazenagem (Stow)",
"area": "Armazenagem por Quantidade (Quantity Stow)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "A quantidade informada pelo AA não corresponde à quantidade colocada na posição."
},
{
"path": "Transferência (Transfer)",
"area": "Transferências de Pod (Pod Transfers)",
"error": "Exclusão pelo ARPodTransferService (ARPodTransferService Deletion)",
"definition": "O item é excluído virtualmente em vez de apenas cancelar o envio do cliente."
},
{
"path": "Transferência (Transfer)",
"area": "Transferências de Pod (Pod Transfers)",
"error": "Erro de Transferência de Pod (Pod Transfer Error)",
"definition": "O defeito foi inserido no inventário durante a indução de Transferência de Pod, podendo ser associado ao site de origem do pod."
},
{
"path": "Transferência (Transfer)",
"area": "Transbordo (Trans-Ship)",
"error": "Etiquetagem Incorreta: Transbordo (Mislabel: Transship)",
"definition": "Um item foi transbordado de outro FC após ser etiquetado incorretamente por um resolvedor de problemas no FC de origem, sendo corrigido durante o IRDR. A unidade pode estar mal etiquetada em relação à progressão de ASIN ou ao título do item em comparação com a unidade física."
},
{
"path": "Transferência (Transfer)",
"area": "Transbordo (Trans-Ship)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "Defeito de IRDR atribuível ao Transbordo (Trans-Ship), mas cuja causa raiz não pode ser determinada."
},
{
"path": "Transferência (Transfer)",
"area": "Transbordo (Trans-Ship)",
"error": "ASIN Errado (Wrong ASIN)",
"definition": "Um item foi transbordado de outro FC sob o ASIN incorreto. A unidade foi adicionada incorretamente ao contêiner de transbordo no FC de origem. A unidade pode ter sido adicionada incorretamente em relação à progressão de ASIN ou ao título do item em comparação com a unidade física."
},
{
"path": "Transferência (Transfer)",
"area": "Transbordo (Trans-Ship)",
"error": "Quantidade Errada (Wrong Quantity)",
"definition": "Um item foi transbordado de outro FC com quantidade incorreta, provavelmente por erro de conjunto quebrado ou masterpack, e foi armazenado sem ser corrigido por um resolvedor de problemas ou identificado por um armazenador antes de ser guardado. O defeito foi localizado durante a contagem de IRDR."
},
{
"path": "Desconhecido (Unknown)",
"area": "Resolução de Problemas (Problem Solve)",
"error": "DC — Departamento Não Identificado (DC - Department Unclear)",
"definition": "O defeito pode ser rastreado até uma ação de resolução de problemas de Inbound, mas o departamento de origem (Recebimento, Armazenagem ou Reabastecimento) não pode ser determinado com certeza. Usado quando a sobreposição de processos impede uma atribuição clara."
},
{
"path": "Desconhecido (Unknown)",
"area": "Desconhecido (Unknown)",
"error": "Deslocamento (Drift)",
"definition": "Defeito de IRDR causado pela movimentação de um item para dentro ou fora da posição, sem que a falha seja atribuível a um processo ou associado específico. Pode ocorrer por itens deslizando pelas frestas entre posições — especialmente em prateleiras tradicionais (como em sites TS/TNS ou posições de damageland) — ou por 'física estranha' (funky physics)."
},
{
"path": "Desconhecido (Unknown)",
"area": "Desconhecido (Unknown)",
"error": "Múltiplas Possibilidades (Multiple Possibilities)",
"definition": "A causa raiz exata não pôde ser identificada devido à possibilidade de múltiplos processos e/ou problemas causando o defeito."
},
{
"path": "Desconhecido (Unknown)",
"area": "Desconhecido (Unknown)",
"error": "Devolução Mal Posicionada (Putback Misplaced)",
"definition": "Unidade(s) foram devolvidas ou extraviadas fisicamente de ou para a posição do IRDR, resultando em uma unidade faltante ou encontrada. As unidades são devolvidas a qualquer posição da face do pod diferente daquela de onde vieram originalmente. Devido a múltiplos processos interagindo com a posição, a área e o processo são desconhecidos."
},
{
"path": "Desconhecido (Unknown)",
"area": "Desconhecido (Unknown)",
"error": "Roubo/Fraude (Theft/Fraud)",
"definition": "O defeito está relacionado a atividade de roubo ou fraude."
},
{
"path": "Desconhecido (Unknown)",
"area": "Desconhecido (Unknown)",
"error": "Problema Desconhecido (Unknown Problem)",
"definition": "O defeito não pode ser vinculado a nenhum processo dentro do ambiente do FC."
},
{
"path": "Desconhecido (Unknown)",
"area": "Desconhecido (Unknown)",
"error": "ASIN Errado: Uso Indevido do Printmon (Wrong ASIN: Printmon Misuse)",
"definition": "Destaca defeitos/ajustes feitos durante o processo de contagem que ficaram incorretos porque o ASIN errado foi impresso e aplicado via Printmon."
}
];
