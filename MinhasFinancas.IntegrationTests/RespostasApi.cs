using System;

namespace MinhasFinancas.IntegrationTests;

public record PessoaResponse(Guid Id, string Nome, DateTime DataNascimento, int Idade);

public record CategoriaResponse(Guid Id, string Descricao, int Finalidade);

public record TransacaoResponse(
    Guid Id,
    string Descricao,
    decimal Valor,
    int Tipo,
    DateTime Data,
    Guid CategoriaId,
    string CategoriaDescricao,
    Guid PessoaId,
    string PessoaNome
);