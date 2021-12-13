using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Contexto;
namespace ProEventos.Persistence
{
    public class PalestrantePersist : IPalestrantePersist
    {
        private readonly ProEventosContext _contex;
        public PalestrantePersist(ProEventosContext _contex)
        {
            this._contex = _contex;

        }

        public async  Task<Palestrante[]> GetAllPalestrantesAsync(bool includeEventos = false)
        {
            IQueryable<Palestrante> query = _contex.Palestrantes
            .Include(p => p.RedesSociais);
          
            if(includeEventos)
            {
                query = query
                .Include(p => p.PalestrantesEventos)
                .ThenInclude(pe =>pe.Evento);
            }

            query = query.AsNoTracking().OrderBy(p => p.Id);
           
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante[]> GetAllPalestrantesByNameAsync(string name, bool includeEventos)
        {
            IQueryable<Palestrante> query = _contex.Palestrantes
            .Include(p => p.RedesSociais);
          
            if(includeEventos)
            {
                query = query
                .Include(p => p.PalestrantesEventos)
                .ThenInclude(pe =>pe.Evento);
            }

            query = query.AsNoTracking().OrderBy(p => p.Id)
            .Where(p => p.User.PrimeiroNome.ToLower().Contains(name.ToLower()));
           
            return await query.ToArrayAsync();
        }

        public async Task<Palestrante> GetPalestranteByIdAsync(int palestranteId, bool includeEventos)
        {
             IQueryable<Palestrante> query = _contex.Palestrantes
            .Include(p => p.RedesSociais);
          
            if(includeEventos)
            {
                query = query
                .Include(p => p.PalestrantesEventos)
                .ThenInclude(pe =>pe.Evento);
            }

            query = query.AsNoTracking().OrderBy(p => p.Id)
            .Where(p => p.Id == palestranteId);
           
            return await query.FirstOrDefaultAsync();
        }

    }
}