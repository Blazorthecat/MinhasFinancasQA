using MinhasFinancas.Domain.Entities;
using Xunit;

namespace MinhasFinancas.UnitTests;

public class PessoaTests
{
    [Fact]
    public void EhMaiorDeIdade_QuandoPessoaTem17Anos_DeveRetornarFalso()
    {
        var pessoaMenorDeIdade = new Pessoa
        {
            Nome = "Teste QA",
            DataNascimento = DateTime.Today.AddYears(-17)
        };

        var resultado = pessoaMenorDeIdade.EhMaiorDeIdade();

        Assert.False(resultado);
    }
}