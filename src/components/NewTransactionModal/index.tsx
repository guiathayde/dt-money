import * as Dialog from '@radix-ui/react-dialog';
import { ArrowCircleDown, ArrowCircleUp, X } from 'phosphor-react';
import * as z from 'zod';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useContextSelector } from 'use-context-selector';

import { TransactionsContext } from '../../hooks/transactions';

import {
  Overlay,
  Content,
  CloseButton,
  TransactionType,
  TransactionTypeButton,
} from './styles';

const newTransactionFormSchema = z.object({
  description: z.string().nonempty(),
  price: z.number().positive(),
  category: z.string().nonempty(),
  type: z.enum(['income', 'outcome']),
});

type NewTransactionFormInputs = z.infer<typeof newTransactionFormSchema>;

interface NewTransactionModalProps {
  setVisibility: (visibility: boolean) => void;
}

export function NewTransactionModal({
  setVisibility,
}: NewTransactionModalProps) {
  const createTransaction = useContextSelector(
    TransactionsContext,
    (context) => context.createTransaction
  );
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<NewTransactionFormInputs>({
    resolver: zodResolver(newTransactionFormSchema),
  });

  async function handleCreateNewTransaction(data: NewTransactionFormInputs) {
    await createTransaction(data);

    reset();

    setVisibility(false);
  }

  return (
    <Dialog.Portal>
      <Overlay />

      <Content>
        <Dialog.Title>Nova transação</Dialog.Title>

        <CloseButton>
          <X size={24} />
        </CloseButton>

        <form onSubmit={handleSubmit(handleCreateNewTransaction)}>
          <input
            type="text"
            placeholder="Descrição"
            required
            {...register('description')}
          />
          <input
            type="number"
            placeholder="Preço"
            required
            {...register('price', { valueAsNumber: true })}
          />
          <input
            type="text"
            placeholder="Categoria"
            required
            {...register('category')}
          />

          <Controller
            control={control}
            name="type"
            render={({ field: { onChange, value } }) => (
              <TransactionType onValueChange={onChange} value={value}>
                <TransactionTypeButton variant="income" value="income">
                  <ArrowCircleUp size={24} />
                  Entrada
                </TransactionTypeButton>

                <TransactionTypeButton variant="outcome" value="outcome">
                  <ArrowCircleDown size={24} />
                  Saída
                </TransactionTypeButton>
              </TransactionType>
            )}
          />

          <button type="submit" disabled={isSubmitting}>
            Cadastrar
          </button>
        </form>
      </Content>
    </Dialog.Portal>
  );
}
