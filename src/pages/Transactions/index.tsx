import { useContextSelector } from 'use-context-selector';

import { TransactionsContext } from '../../hooks/transactions';

import { Header } from '../../components/Header';
import { Summary } from '../../components/Summary';
import { SearchForm } from './components/SearchForm';

import { dateFormatter, priceFormatter } from '../../utils/formatter';

import {
  PriceHighlight,
  TransactionsContainer,
  TransactionsTable,
} from './styles';

export function Transactions() {
  const transactions = useContextSelector(
    TransactionsContext,
    (context) => context.transactions
  );

  return (
    <>
      <Header />
      <Summary />

      <TransactionsContainer>
        <SearchForm />

        <TransactionsTable>
          <tbody>
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td width="50%">{transaction.description}</td>
                <td>
                  <PriceHighlight varient={transaction.type}>
                    {transaction.type === 'outcome' && '- '}
                    {priceFormatter.format(transaction.price)}
                  </PriceHighlight>
                </td>
                <td>{transaction.category}</td>
                <td>{dateFormatter.format(new Date(transaction.createdAt))}</td>
              </tr>
            ))}
          </tbody>
        </TransactionsTable>
      </TransactionsContainer>
    </>
  );
}
