import { SingleProduct, ListOfProducts } from "../TSinterfaces";

function Product(props: { currentPagination: ListOfProducts | null }) {
  return (
    <div className="items">
      {props.currentPagination &&
        props.currentPagination.map((item: SingleProduct, index: number) => {
          return (
            <div className="singleItem" key={index}>
              {item.node.name}
              <br />
              <img src={item.node.thumbnailImage.file.url} alt={`${item.node.name}`} style={{ width: "100px" }} />
              <br />$ {item.node.shopifyProductEu.variants.edges[0].node.price}
            </div>
          );
        })}
    </div>
  );
}

export default Product;
