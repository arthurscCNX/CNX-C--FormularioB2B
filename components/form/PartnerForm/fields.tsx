'use client';

import { useId } from 'react';
import s from './styles.module.css';

export function Field({
  label,
  hint,
  erro,
  obrigatorio,
  span2,
  children,
  htmlFor,
}: {
  label: string;
  hint?: string;
  erro?: string;
  obrigatorio?: boolean;
  span2?: boolean;
  children: React.ReactNode;
  htmlFor?: string;
}) {
  return (
    <div className={`${s.field} ${span2 ? s.span2 : ''}`}>
      <label htmlFor={htmlFor}>
        {label}
        {obrigatorio && <span className={s.req}>*</span>}
      </label>
      {children}
      {hint && <span className={s.hint}>{hint}</span>}
      {erro && <span className={`${s['chip-error']} ${s.show}`}>{erro}</span>}
    </div>
  );
}

export function TextoField({
  nome,
  label,
  placeholder,
  hint,
  erro,
  obrigatorio,
  span2,
  tipo = 'text',
  inputMode,
  maxLength,
  valor,
  aoMudar,
}: {
  nome: string;
  label: string;
  placeholder?: string;
  hint?: string;
  erro?: string;
  obrigatorio?: boolean;
  span2?: boolean;
  tipo?: string;
  inputMode?: 'text' | 'tel' | 'numeric' | 'decimal' | 'email';
  maxLength?: number;
  valor: string;
  aoMudar: (v: string) => void;
}) {
  return (
    <Field
      label={label}
      hint={hint}
      erro={erro}
      obrigatorio={obrigatorio}
      span2={span2}
      htmlFor={nome}
    >
      <input
        id={nome}
        name={nome}
        type={tipo}
        placeholder={placeholder}
        inputMode={inputMode}
        maxLength={maxLength}
        value={valor}
        aria-invalid={erro ? true : undefined}
        onChange={(e) => aoMudar(e.target.value)}
      />
    </Field>
  );
}

export function AreaField({
  nome,
  label,
  placeholder,
  hint,
  erro,
  obrigatorio,
  valor,
  aoMudar,
  alturaMinima,
}: {
  nome: string;
  label: string;
  placeholder?: string;
  hint?: string;
  erro?: string;
  obrigatorio?: boolean;
  valor: string;
  aoMudar: (v: string) => void;
  alturaMinima?: number;
}) {
  return (
    <Field
      label={label}
      hint={hint}
      erro={erro}
      obrigatorio={obrigatorio}
      htmlFor={nome}
    >
      <textarea
        id={nome}
        name={nome}
        placeholder={placeholder}
        value={valor}
        aria-invalid={erro ? true : undefined}
        style={alturaMinima ? { minHeight: alturaMinima } : undefined}
        onChange={(e) => aoMudar(e.target.value)}
      />
    </Field>
  );
}

export function ChipGroup({
  label,
  opcoes,
  selecionados,
  aoAlternar,
  erro,
  multiplo,
  pequeno,
  obrigatorio,
}: {
  label: string;
  opcoes: readonly string[];
  selecionados: string[];
  aoAlternar: (valor: string) => void;
  erro?: string;
  multiplo?: boolean;
  pequeno?: boolean;
  obrigatorio?: boolean;
}) {
  const id = useId();
  return (
    <div className={`${s.field} ${s.span2}`}>
      <label id={id}>
        {label}
        {obrigatorio && <span className={s.req}>*</span>}
      </label>
      <div
        className={`${s['chip-group']} ${pequeno ? s.small : ''}`}
        role="group"
        aria-labelledby={id}
      >
        {opcoes.map((opcao) => {
          const ativo = selecionados.includes(opcao);
          return (
            <button
              key={opcao}
              type="button"
              className={s.chip}
              aria-pressed={ativo}
              onClick={() => aoAlternar(opcao)}
            >
              {opcao}
            </button>
          );
        })}
      </div>
      {erro && <span className={`${s['chip-error']} ${s.show}`}>{erro}</span>}
      {multiplo && <span className={s.hint}>Pode marcar mais de um.</span>}
    </div>
  );
}
