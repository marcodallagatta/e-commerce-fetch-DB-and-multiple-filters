export type SingleProduct = {
  node: {
    name: string;
    node_locale: string;
    thumbnailImage: {
      file: {
        url: string;
      };
    };
    colorFamily: { name: string }[] | null;
    categoryTags: string[] | null;
    shopifyProductEu: {
      variants: {
        edges: [
          {
            node: {
              price: string;
            };
          }
        ];
      };
    };
  };
};

export type ListOfProducts = SingleProduct[];
