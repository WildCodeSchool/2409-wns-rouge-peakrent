export const GET_TAGS = `
  query getTags {
    getTags {
      id
      name
    }
  }
`;

export const GET_ALL_ADS_THAT_HAVE_TAG = `
  query Query($param: String!, $onPage: Int!, $page: Int!) {
    getTagById(param: $param, onPage: $onPage, page: $page) {
      tag {
        name
      }
      ads {
        id
        picture
        price
        title
      }
      pagination {
        total
        currentPage
        totalPages
      }
    }
  }
`;
