using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contexto;
using ProEventos.Persistence.Contratos;

namespace ProEventos.Persistence
{
    public class LotePersist: ILotePersist
    {
        private readonly ProEventosContext _contex;
         public LotePersist(ProEventosContext contex)
        {
           _contex = contex;
       

        }
    public async Task<Lote> GetLotesByIdsAsync(int eventoId, int id)
        {
           IQueryable<Lote> query = _contex.Lotes;
           query = query.AsNoTracking()
           .Where(lote => lote.EventoId == eventoId && lote.Id ==id);
         
           return await query.FirstOrDefaultAsync();
        } 
        public async Task<Lote[]> GetLotesByEventoIdAsync(int eventoId)
        {
           IQueryable<Lote> query = _contex.Lotes;
           query = query.AsNoTracking()
           .Where(lote => lote.EventoId == eventoId);
           return await query.ToArrayAsync();
        }
        }

    }
