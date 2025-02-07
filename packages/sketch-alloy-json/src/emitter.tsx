import * as ay from "@alloy-js/core";
import {SourceFile, JsonObject, JsonObjectProperty} from "@alloy-js/json";
import { EmitContext } from "@typespec/compiler"

export async function $onEmit(context: EmitContext) {
    return <ay.Output>
        <SourceFile path="test.json">
            <JsonObject>
                <JsonObjectProperty name="foo">12</JsonObjectProperty>,
                <JsonObjectProperty name="bar">
                    13
                </JsonObjectProperty>
            </JsonObject>
        </SourceFile>
    </ay.Output>
}