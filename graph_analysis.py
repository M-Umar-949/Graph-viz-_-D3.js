# app.py

from flask import Flask, render_template, request
import pandas as pd
import networkx as nx

app = Flask(__name__)

def analyze_graph(file_path):
    df = pd.read_csv(file_path)

    nodes = df.columns[1:]
    edges = [(row['Unnamed: 0'], node) for _, row in df.iterrows() for node in nodes if row[node] > 0]

    G = nx.DiGraph()
    G.add_nodes_from(nodes)
    G.add_edges_from(edges)

    undirected_G = G.to_undirected()
    is_connected = nx.is_connected(undirected_G)

    # Checking if the graph is a DAG
    is_dag = nx.is_directed_acyclic_graph(G)

    # Checking if the graph is a Tree
    is_tree = is_dag and all(len(list(G.predecessors(node))) == 1 for node in nodes if node != nodes[0])

    # Determine the type of graph
    graph_type = "General"
    if is_dag:
        if is_tree:
            graph_type = "tree"
        else:
            graph_type = "DAG"
    elif is_connected:
        graph_type = "General"

    return is_connected, graph_type

@app.route("/", methods=["GET", "POST"])
def index():
    graph_type = None

    if request.method == "POST":
        file = request.files["file"]
        if file:
            filename=file.filename
            print(filename)

            is_connected, graph_type = analyze_graph(file)
            if is_connected:
                if graph_type == "tree":
                    return render_template("index.html", graph_type="Tree",filename=filename)
                elif graph_type == "DAG":
                    return render_template("index.html", graph_type="DAG",filename=filename)
                elif graph_type == "General":
                    return render_template("index.html", graph_type="General",filename=filename)

            return render_template("index.html", error_message="Not connected")

    return render_template("index.html", graph_type=graph_type)

if __name__ == "__main__":
    app.run(debug=True)
