/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Author = {
  __typename?: 'Author';
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  reviews?: Maybe<Array<Review>>;
  verified: Scalars['Boolean']['output'];
};

export type Game = {
  __typename?: 'Game';
  id: Scalars['ID']['output'];
  platforms: Array<Scalars['String']['output']>;
  reviews?: Maybe<Array<Review>>;
  title?: Maybe<Scalars['String']['output']>;
};

export type GameInputMutation = {
  platforms: Array<Scalars['String']['input']>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type InputUpdateGame = {
  platforms?: InputMaybe<Array<Scalars['String']['input']>>;
  title?: InputMaybe<Scalars['String']['input']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  addGame?: Maybe<Game>;
  deleteGame?: Maybe<Array<Maybe<Game>>>;
  updateGame?: Maybe<Game>;
};


export type MutationAddGameArgs = {
  game?: InputMaybe<GameInputMutation>;
};


export type MutationDeleteGameArgs = {
  id: Scalars['ID']['input'];
};


export type MutationUpdateGameArgs = {
  game?: InputMaybe<InputUpdateGame>;
  id: Scalars['ID']['input'];
};

export type Query = {
  __typename?: 'Query';
  author?: Maybe<Author>;
  authors?: Maybe<Array<Maybe<Author>>>;
  game?: Maybe<Game>;
  games?: Maybe<Array<Maybe<Game>>>;
  review?: Maybe<Review>;
  reviews?: Maybe<Array<Maybe<Review>>>;
};


export type QueryAuthorArgs = {
  id: Scalars['ID']['input'];
};


export type QueryGameArgs = {
  id: Scalars['ID']['input'];
};


export type QueryReviewArgs = {
  id: Scalars['ID']['input'];
};

export type Review = {
  __typename?: 'Review';
  author: Author;
  content: Scalars['String']['output'];
  game: Game;
  id: Scalars['ID']['output'];
  rating: Scalars['Int']['output'];
};

export type Subscription = {
  __typename?: 'Subscription';
  gameAdded?: Maybe<Game>;
};

export type GetGamesQueryVariables = Exact<{ [key: string]: never; }>;


export type GetGamesQuery = { __typename?: 'Query', games?: Array<(
    { __typename?: 'Game', title?: string | null, id: string }
    & { ' $fragmentRefs'?: { 'ReviewsGameFragment': ReviewsGameFragment } }
  ) | null> | null };

export type ReviewsGameFragment = { __typename?: 'Game', reviews?: Array<{ __typename?: 'Review', id: string, content: string }> | null } & { ' $fragmentName'?: 'ReviewsGameFragment' };

export type AddGameMutationVariables = Exact<{
  game?: InputMaybe<GameInputMutation>;
}>;


export type AddGameMutation = { __typename?: 'Mutation', addGame?: { __typename?: 'Game', title?: string | null, id: string } | null };

export type DeleteGameMutationVariables = Exact<{
  id: Scalars['ID']['input'];
}>;


export type DeleteGameMutation = { __typename?: 'Mutation', deleteGame?: Array<{ __typename?: 'Game', title?: string | null, id: string } | null> | null };

export type GameAddedSubscriptionVariables = Exact<{ [key: string]: never; }>;


export type GameAddedSubscription = { __typename?: 'Subscription', gameAdded?: { __typename?: 'Game', title?: string | null } | null };

export type NewGameFragment = { __typename?: 'Game', id: string, title?: string | null } & { ' $fragmentName'?: 'NewGameFragment' };

export const ReviewsGameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReviewsGame"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<ReviewsGameFragment, unknown>;
export const NewGameFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"NewGame"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]} as unknown as DocumentNode<NewGameFragment, unknown>;
export const GetGamesDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"GetGames"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"games"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"ReviewsGame"}}]}}]}},{"kind":"FragmentDefinition","name":{"kind":"Name","value":"ReviewsGame"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Game"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"reviews"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"content"}}]}}]}}]} as unknown as DocumentNode<GetGamesQuery, GetGamesQueryVariables>;
export const AddGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"game"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"GameInputMutation"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"game"},"value":{"kind":"Variable","name":{"kind":"Name","value":"game"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<AddGameMutation, AddGameMutationVariables>;
export const DeleteGameDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteGame"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteGame"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<DeleteGameMutation, DeleteGameMutationVariables>;
export const GameAddedDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"subscription","name":{"kind":"Name","value":"GameAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"gameAdded"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"title"}}]}}]}}]} as unknown as DocumentNode<GameAddedSubscription, GameAddedSubscriptionVariables>;