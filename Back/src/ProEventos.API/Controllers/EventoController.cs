using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using ProEventos.Persistence;

using ProEventos.Persistence.Contexto;
using ProEventos.Application.Contratos;
using Microsoft.AspNetCore.Http;
using ProEventos.Application.Dtos;
using Microsoft.AspNetCore.Hosting;
using System.IO;

namespace ProEventos.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class EventoController : ControllerBase
    {
        private readonly IEventoService _eventoService;
        private readonly IWebHostEnvironment _hostEnviroment;
        public EventoController(IEventoService eventoService, IWebHostEnvironment hostEnviroment)
        {   _hostEnviroment = hostEnviroment;
            _eventoService = eventoService;
        }

        [HttpGet]
        public async Task <IActionResult> Get()
        {
          try
          {
              var eventos = await _eventoService.GetAllEventosAsync(true);
              if (eventos == null) return NoContent();
            
              return Ok(eventos);
          }
          catch(Exception ex)
          {
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. ERRO: {ex.Message}");
          }

        }

        [HttpGet("{id}")]
        public async Task <IActionResult> GetById(int id)
        { try
          {
              var evento = await _eventoService.GetEventoByIdAsync(id, true);
              if (evento == null) return NoContent();
              return Ok(evento);
          }
          catch(Exception ex)
          {
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. ERRO: {ex.Message}");
          }
        }

          [HttpGet("{tema}/tema")]
        public async Task <IActionResult> GetByTema(string tema)
        { try
          {
              var evento = await _eventoService.GetAllEventosByTemaAsync(tema, true);
              if (evento == null) return NoContent();
              return Ok(evento);
          }
          catch(Exception ex)
          {
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. ERRO: {ex.Message}");
          }
        }

        [HttpPost("upload-image/{eventoId}")]
        public async Task <IActionResult> UploadImage(int eventoId)
        { try
          {
            Console.WriteLine(eventoId);
              var evento = await _eventoService.GetEventoByIdAsync(eventoId, true);
              if (evento == null) return NoContent();
              var file =Request.Form.Files[0];
              if(file.Length>0){
                DeleteImage(evento.ImagemURL);
                evento.ImagemURL = await SaveImage(file);
              }
              var eventoRetorno = await _eventoService.UpdateEvento(eventoId, evento);
              return Ok(eventoRetorno);
          }
          catch(Exception ex)
          {
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar eventos. ERRO: {ex.Message}");
          }
        }


        [HttpPost]
        public async Task <IActionResult> Post(EventoDto model)
        { try
          {
              var evento = await _eventoService.AddEvento(model);
              if (evento == null) return NoContent();
              return Ok(evento);
          }
          catch(Exception ex)
          {
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar atualizar eventos. ERRO: {ex.Message}");
          }
        }

         [HttpPut("{id}")]
        public async Task <IActionResult> Put(int id, EventoDto model)
        { try
          {
              var evento = await _eventoService.UpdateEvento(id, model);
              if (evento == null) return NoContent();
              return Ok(evento);
          }
          catch(Exception ex)
          {
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar recuperar eventos. ERRO: {ex.Message}");
          }
        }
          [HttpDelete("{id}")]
        public async Task <IActionResult> Delete(int id)
        { try
          {
              var evento = await _eventoService.GetEventoByIdAsync(id, true);
              if (evento == null) return NoContent();

            if(await _eventoService.DeleteEvento(id)){
              DeleteImage(evento.ImagemURL);
             return Ok( new {menssage = "Deletado"});
            }
            else
            {
             throw new Exception("Ocorreu um erro ao deletar o evento");
            }
          }
          catch(Exception ex)
          {
            return this.StatusCode(StatusCodes.Status500InternalServerError, $"Erro ao tentar deletar eventos. ERRO: {ex.Message}");
          }
        }

        [NonAction]
        public void DeleteImage(string imageName)
        {
          var imagePath= Path.Combine(_hostEnviroment.ContentRootPath, @"Resources/images", imageName);
          if(System.IO.File.Exists(imagePath))
          System.IO.File.Delete(imagePath);
        }
  
        [NonAction]
        public async Task<string> SaveImage(IFormFile imageFile)
        {
            string imageName = new String(Path.GetFileNameWithoutExtension(imageFile.FileName)
                                              .Take(10)
                                              .ToArray()
                                         ).Replace(' ', '-');
            imageName= $"{imageName}{DateTime.UtcNow.ToString("yymmssfff")}{Path.GetExtension(imageFile.FileName)}";
            var imagePath = Path.Combine(_hostEnviroment.ContentRootPath, @"Resources/images", imageName);

       using(var FileStream = new FileStream(imagePath, FileMode.Create))
       {
         await imageFile.CopyToAsync(FileStream);
       }
       return imageName;
        }
    }

}