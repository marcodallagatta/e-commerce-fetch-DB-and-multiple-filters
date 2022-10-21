function Product(props: { currentPagination: string[] | null }) {
  return (
    <div className="items">
      {props.currentPagination &&
        props.currentPagination.map((item: any, index: number) => {
          return (
            <div className="singleItem" key={index}>
              {item.node.name}
              <br />
              <img src={item.node.thumbnailImage.file.url} alt={`${item.node.name} picture`} style={{ width: "100px" }} />
              <br />$ {item.node.shopifyProductEu.variants.edges[0].node.price}
            </div>
          );
        })}
    </div>
  );
}

export default Product;
