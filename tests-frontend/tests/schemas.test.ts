import { describe, it, expect } from 'vitest';
import { pessoaSchema, transacaoSchema } from '../../../ExameDesenvolvedorDeTestes/web/src/lib/schemas';
import { TipoTransacao } from '../../../ExameDesenvolvedorDeTestes/web/src/types/domain';

describe('pessoaSchema', () => {

  it('valida uma pessoa com dados corretos', () => {
    const resultado = pessoaSchema.safeParse({
      nome: 'João Silva',
      dataNascimento: new Date('1990-01-01'),
    });

    expect(resultado.success).toBe(true);
  });

  it('rejeita nome vazio', () => {
    const resultado = pessoaSchema.safeParse({
      nome: '',
      dataNascimento: new Date('1990-01-01'),
    });

    expect(resultado.success).toBe(false);
  });

});