/*
  Controle de desbloqueios. Para testar todas as fases durante o desenvolvimento
*/
const PROGRESSAO_ATIVA = true; // true para ativar, false para desativar

const Progressao = (() => {
  const chave = "potenciacao-progresso";
  const fases = ["vila", "arvore", "portao", "castelo"];
  const totalDeChefes = 3;

  function ler() {
    try {
      return JSON.parse(localStorage.getItem(chave)) || { bossesVencidos: {} };
    } catch {
      return { bossesVencidos: {} };
    }
  }

  function salvar(progresso) {
    localStorage.setItem(chave, JSON.stringify(progresso));
  }

  function chefesDaFase(fase) {
    return Array.isArray(window.phaseBosses?.[fase]) ? window.phaseBosses[fase].length : totalDeChefes;
  }

  function faseLiberada(fase) {
    if (!PROGRESSAO_ATIVA) return true;
    const indice = fases.indexOf(fase);
    if (indice <= 0) return indice === 0;
    const anterior = fases[indice - 1];
    const vencidos = ler().bossesVencidos[anterior] || [];
    const total = chefesDaFase(anterior);
    return total > 0 && vencidos.length >= total;
  }

  function chefeLiberado(fase, indice) {
    if (!PROGRESSAO_ATIVA || !faseLiberada(fase)) return !PROGRESSAO_ATIVA;
    if (indice === 0) return true;
    return (ler().bossesVencidos[fase] || []).includes(indice - 1);
  }

  function chefeVencido(fase, indice) {
    return (ler().bossesVencidos[fase] || []).includes(indice);
  }

  function faseConcluida(fase) {
    const total = chefesDaFase(fase);
    return total > 0 && (ler().bossesVencidos[fase] || []).length >= total;
  }

  function registrarVitoria(fase, indice) {
    if (!PROGRESSAO_ATIVA) return;
    const progresso = ler();
    const vencidos = progresso.bossesVencidos[fase] || [];
    if (!vencidos.includes(indice)) vencidos.push(indice);
    progresso.bossesVencidos[fase] = vencidos;
    salvar(progresso);
  }

  function reiniciar() {
    localStorage.removeItem(chave);
  }

  return { ativa: PROGRESSAO_ATIVA, faseLiberada, chefeLiberado, chefeVencido, faseConcluida, registrarVitoria, reiniciar };
})();

window.Progressao = Progressao;
