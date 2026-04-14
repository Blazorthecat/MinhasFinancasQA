using System;
using System.Threading.Tasks;
using Moq;
using Xunit;
using MinhasFinancas.Application.Services;
using MinhasFinancas.Application.DTOs;
using MinhasFinancas.Domain.Entities;
using MinhasFinancas.Domain.Interfaces;

namespace MinhasFinancas.UnitTests;

public class TransacaoServiceTests
{
  [Fact]
  public async Task CreateAsync_QuandoPessoaMenorDeIdadeTentaCriarReceita_DeveLancarExcecao()
  {
    var pessoaId = Guid.NewGuid();
    var categoriaId = Guid.NewGuid();

    var pessoaMenor = new Pessoa
    {
      Id = pessoaId,
      Nome = "Jovem Aprendiz QA",
      DataNascimento = DateTime.Today.AddYears(-17)
    };

    var categoria = new Categoria
    {
      Id = categoriaId,
      Descricao = "Mesada",
      Finalidade = Categoria.EFinalidade.Receita
    };

    var mockPessoasRepo = new Mock<IPessoaRepository>();
    mockPessoasRepo.Setup(repo => repo.GetByIdAsync(pessoaId)).ReturnsAsync(pessoaMenor);

    var mockCategoriasRepo = new Mock<ICategoriaRepository>();
    mockCategoriasRepo.Setup(repo => repo.GetByIdAsync(categoriaId)).ReturnsAsync(categoria);

    var mockUnitOfWork = new Mock<IUnitOfWork>();
    mockUnitOfWork.Setup(uow => uow.Pessoas).Returns(mockPessoasRepo.Object);
    mockUnitOfWork.Setup(uow => uow.Categorias).Returns(mockCategoriasRepo.Object);

    var transacaoService = new TransacaoService(mockUnitOfWork.Object);

    var dto = new CreateTransacaoDto
    {
      PessoaId = pessoaId,
      CategoriaId = categoriaId,
      Valor = 500,
      Data = DateTime.Now,
      Tipo = Transacao.ETipo.Receita
    };

    await Assert.ThrowsAsync<InvalidOperationException>(() => transacaoService.CreateAsync(dto));
  }
}