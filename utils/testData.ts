import { faker } from '@faker-js/faker';

export interface UserData {
  username: string;
  email: string;
  password: string;
}

export interface ArticleData {
  title: string;
  description: string;
  body: string;
  tagList: string[];
}

export function uniqueUser(): UserData {
  const unique = faker.string.alphanumeric(8).toLowerCase();
  return {
    username: `${faker.person.firstName().toLowerCase()}${unique}`,
    email: `${unique}@example.com`,
    password: faker.internet.password({ length: 12 }),
  };
}

export function uniqueComment(): string {
  return `${faker.lorem.sentence()} ${faker.string.alphanumeric(6)}`;
}

export function uniqueArticle(): ArticleData {
  return {
    title: `${faker.lorem.words({ min: 3, max: 6 })} ${faker.string.alphanumeric(6)}`,
    description: faker.lorem.sentence(),
    body: faker.lorem.paragraphs(2),
    tagList: faker.helpers.arrayElements(['testing', 'automation', 'playwright', 'api'], {
      min: 1,
      max: 2,
    }),
  };
}
