using System.Threading.Tasks;
using ProEventos.Domain;

namespace ProEventos.Persistence.Contratos
{
    public interface ILotePersist 
    {

        Task<Lote[]> GetLotesByEventoIdAsync(int eventoId);

        /// <summary>
        /// Metodo get que retornara apenas 1 lote
        /// </summary>
        /// <param name="eventoId"></param>
        /// <param name="id"> Código chave da tabela lote</param>
        /// <returns>apenas 1 lote</returns>
        Task<Lote> GetLotesByIdsAsync(int eventoId, int id);

    }
}