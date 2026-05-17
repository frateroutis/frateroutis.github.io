# DRUM TOy Sound Assets Folder

Coloque os seus samples de som retro nesta pasta. O motor do sequenciador faz a busca exatamente por esses nomes de arquivos.

## Nomes e Formatos de Arquivos Recomendados:
* `808.wav` -> Sub-grave / Grave de 808 profundo
* `kick.wav` -> Bumbo / Kick acústico ou eletrônico seco
* `snap.wav` -> Snap / Estalo de dedo seco
* `snare.wav` -> Caixa / Snare clássica
* `clap.wav` -> Clap / Palma retro estalada
* `hihat_closed.wav` -> Hi-Hat Fechado / Closed Hat
* `hihat_open.wav` -> Hi-Hat Aberto / Open Hat

> [!TIP]
> Por padrão, o motor no arquivo `js/windows95.js` está configurado para ler arquivos no formato `.wav`. Se você preferir usar `.mp3`, basta alterar as extensões dos caminhos dentro da função `loadDrumSamples()`!
