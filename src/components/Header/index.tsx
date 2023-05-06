import { useState } from 'react';
import * as Dialog from '@radix-ui/react-dialog';

import { NewTransactionModal } from '../NewTransactionModal';

import { HeaderContainer, HeaderContent, NewTransactionButton } from './styles';

import logoImg from '../../assets/logo.svg';

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <HeaderContainer>
      <HeaderContent>
        <img src={logoImg} alt="DT Money Logo" />

        <Dialog.Root open={open}>
          <Dialog.Trigger asChild>
            <NewTransactionButton>Nova transação</NewTransactionButton>
          </Dialog.Trigger>

          <NewTransactionModal setVisibility={setOpen} />
        </Dialog.Root>
      </HeaderContent>
    </HeaderContainer>
  );
}
