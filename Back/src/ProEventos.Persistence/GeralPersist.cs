using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using ProEventos.Domain;
using ProEventos.Persistence.Contratos;
using ProEventos.Persistence.Contexto;
namespace ProEventos.Persistence
{
    public class GeralPersist :IGeralPersist
    {
        private readonly ProEventosContext _contex;
        public GeralPersist(ProEventosContext _contex)
        {
            this._contex = _contex;

        }

        public void add<T>(T entity) where T : class
        {
           _contex.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _contex.Remove(entity);
        }
        public async Task<bool> SaveChangesAsync()
        {
           return (await _contex.SaveChangesAsync()) > 0;
        }

        public void update<T>(T entity) where T : class
        {
            _contex.Update(entity);
        }
        public void DeleteRange<T>(T[] entityArray) where T : class
        {
            _contex.RemoveRange(entityArray);
        }

       

    }
}