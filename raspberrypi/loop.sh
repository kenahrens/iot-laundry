for VARIABLE in 1 2 3 4
do
        echo "Starting run $VARIABLE"
        curl http://localhost:5000/img
        echo ""
        sleep 15
done
