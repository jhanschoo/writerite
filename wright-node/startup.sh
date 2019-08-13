sed -i "s/import { gql } from 'graphql.macro';/import gql from 'graphql-tag';/" src/models/*
npm run start:dev