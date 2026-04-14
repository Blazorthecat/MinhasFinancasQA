using System.Net;
using System.Net.Http.Json;
using Xunit;

namespace MinhasFinancas.IntegrationTests;

public class TransacoesIntegrationTests : IClassFixture<MinhasFinancasFactory>
{
  private readonly HttpClient _client;

  public TransacoesIntegrationTests(MinhasFinancasFactory factory)
  {
    _client = factory.CreateClient();
  }

  [Fact]
  public async Task PostTransacao_SendoAdultoEDespesa_RetornaCreated()
  {
    var categoriaResponse = await _client.PostAsJsonAsync("/api/v1/categorias", new { descricao = "Supermercado", finalidade = 0 });
    var categoria = await categoriaResponse.Content.ReadFromJsonAsync<CategoriaResponse>();

    var pessoaResponse = await _client.PostAsJsonAsync("/api/v1/pessoas", new { nome = "João Adulto", dataNascimento = "1990-01-01" });
    var pessoa = await pessoaResponse.Content.ReadFromJsonAsync<PessoaResponse>();

    var transacaoResponse = await _client.PostAsJsonAsync("/api/v1/transacoes", new
    {
      descricao = "Compra do mês",
      valor = 500.00,
      tipo = 0,
      categoriaId = categoria.Id,
      pessoaId = pessoa.Id,
      data = "2024-06-15"
    });

    Assert.Equal(HttpStatusCode.Created, transacaoResponse.StatusCode);
  }

  [Fact]
  public async Task PostTransacao_MenorDeIdadeTentandoTerReceita()
  {
    var categoriaResponse = await _client.PostAsJsonAsync("/api/v1/categorias", new { descricao = "Mesada", finalidade = 1 });
    var categoria = await categoriaResponse.Content.ReadFromJsonAsync<CategoriaResponse>();

    var pessoaResponse = await _client.PostAsJsonAsync("/api/v1/pessoas", new { nome = "Enzo Menor", dataNascimento = "2015-01-01" });
    var pessoa = await pessoaResponse.Content.ReadFromJsonAsync<PessoaResponse>();

    var transacaoResponse = await _client.PostAsJsonAsync("/api/v1/transacoes", new
    {
      descricao = "Presente",
      valor = 100.00,
      tipo = 1,
      categoriaId = categoria.Id,
      pessoaId = pessoa.Id,
      data = "2024-06-15"
    });

    Assert.Equal(HttpStatusCode.InternalServerError, transacaoResponse.StatusCode);
  }
}