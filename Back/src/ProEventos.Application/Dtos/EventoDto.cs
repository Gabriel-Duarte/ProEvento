using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace ProEventos.Application.Dtos
{
    public class EventoDto
    {
         public int Id { get; set; }
        public string Local { get; set; }
        public string DataEvento { get; set; }
        
        [Required(ErrorMessage ="o campo {0} é obrigatorio"),
        StringLength(50, MinimumLength =3, ErrorMessage ="Intervalo permitido de 3 a 50 Caracteres")]
        public string Tema { get; set; }
        [Display (Name ="Qtd Pessoa"),
        Range(1,120000, ErrorMessage ="{0} não pode ser menor que 1 e maior que 120.000")]
        public int QtdPessoas { get; set; }
         [RegularExpression(@".*\.(gif|jpe?g|bmp|png)$",
                           ErrorMessage = "Não é uma imagem válida. (gif, jpg, jpeg, bmp ou png)")]
        public string ImagemURL { get; set; }
         [Required(ErrorMessage ="o campo {0} é obrigatorio"),
          Phone(ErrorMessage ="o campo {0} esta com numero invalido")]
        public string Telefone { get; set; }

        [Required(ErrorMessage ="o campo {0} é obrigatorio"),
         Display(Name = "e-mail"),
         EmailAddress(ErrorMessage ="o e-mail {0} é invalido")]

        public string Email { get; set; }
         public IEnumerable<LoteDto> Lotes { get; set; }
         public IEnumerable<RedeSocialDto> RedesSociais { get; set; }
         public IEnumerable<PalestranteDto> PalestrantesEventos { get; set; }
    }
}