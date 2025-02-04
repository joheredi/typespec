import * as ay from "@alloy-js/core";
import { $ } from "@typespec/compiler/typekit";
import { HttpOperationPart } from "@typespec/http";
import { ArrayPartTransform } from "./array-part-transform.jsx";
import { FilePartTransform } from "./file-part-transform.jsx";
import { SimplePartTransform } from "./simple-part-transform.jsx";

export interface HttpPartTransformProps {
  part: HttpOperationPart;
  itemRef: ay.Children;
}

export function HttpPartTransform(props: HttpPartTransformProps) {
  if ($.httpPart.isArray(props.part)) {
    return <ArrayPartTransform part={props.part} itemRef={props.itemRef}/>;
  }

  if ($.httpPart.isFile(props.part)) {
    return <FilePartTransform part={props.part} itemRef={props.itemRef} />;
  }

  return <SimplePartTransform part={props.part} itemRef={props.itemRef} />;
}
